from ..db import Database
from flask import jsonify
import bcrypt
import psycopg2 
from datetime import date, datetime, timedelta, time

class User:
    def __init__(self):
        self.id = None
        self.name = None
        self.email = None
        self.password = None
        self.db = Database()
        self.settings_finished = None


    def find_by_email(self, email):
        try:
            self.db.cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            result = self.db.cursor.fetchone()
            if result:
                self.setUser(result[0], result[1], result[2], result[3], result[4])
                return self
        except psycopg2.Error as e:
            print(f"Database error during find_by_email: {e}")
            return None
    
    def setUser(self, id, name, email, password, settings_finished):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.settings_finished = settings_finished

    def signupUser(self, name, email, password):
        try:
            self.db.cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            result = self.db.cursor.fetchall()
            if len(result) > 0:
                self.db.close()
                return None  # Email already exists

            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') #hashing users entered password
            self.db.cursor.execute(
                "INSERT INTO users (name, email, password, settings_finished) VALUES (%s, %s, %s, %s) RETURNING id, name, email, password, settings_finished",
                (name, email, hashed, False)
            )
            self.db.conn.commit()
            result = self.db.cursor.fetchone()
            self.setUser(result[0], result[1], result[2], result[3], result[4])  # result[3] is the hashed password
            return self
        except psycopg2.Error as e:
            print(f"Database error during signupUser: {e}")
            self.db.conn.rollback()
        finally:
            self.db.close()
        return None
    
    def setSettings(self, calories_per_day, meals_per_day, hours_sleep, bedtime, wakeupTime, notificationsMeals, notificationsSleep):
        try:
            # Check if the user already has settings in the database
            self.db.cursor.execute("SELECT * FROM user_settings WHERE user_id = %s", (self.id,))
            result = self.db.cursor.fetchone()
            
            if result:
                # If settings exist, update them
                self.db.cursor.execute("""
                    UPDATE user_settings
                    SET calories_per_day = %s,
                        meals_per_day = %s,
                        sleep_hours = %s,
                        bedtime = %s,
                        wakeup_time = %s,
                        notifications_sleep = %s,
                        notifications_meals = %s,
                        updated_at = NOW()
                    WHERE user_id = %s
                """, (
                    calories_per_day,
                    meals_per_day,
                    hours_sleep,
                    bedtime,
                    wakeupTime,
                    notificationsSleep,
                    notificationsMeals,
                    self.id
                ))
                self.db.conn.commit()  
                return {"message": "Settings updated successfully"}
            else:
                # If no settings exist for the user, insert new settings
                self.db.cursor.execute("""
                    INSERT INTO user_settings (user_id, calories_per_day, meals_per_day, sleep_hours, bedtime, wakeup_time, notifications_sleep, notifications_meals, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                """, (
                    self.id,
                    calories_per_day,
                    meals_per_day,
                    hours_sleep,
                    bedtime,
                    wakeupTime,
                    notificationsSleep,
                    notificationsMeals
                ))
                self.db.conn.commit()  
                self.db.cursor.execute("UPDATE users SET settings_finished = true WHERE id = %s", (self.id,))
                self.db.conn.commit()
                self.find_by_email(self.email)
                user = {
                    "id": self.id,
                    "name": self.name,
                    "email": self.email,
                    "password": self.password,
                    "settings_finished": self.settings_finished
                }

                return user 
        except psycopg2.Error as e:
            print(f"Database error during setSettings: {e}")
            self.db.conn.rollback()  # Rollback the transaction in case of error
            return None

        
    def getSettings(self):
        try:
            # Query the settings for the current user (using self.id)
            self.db.cursor.execute("SELECT * FROM user_settings WHERE user_id = %s", (self.id,))
            result = self.db.cursor.fetchone()

            if result:
                # If settings are found, return the settings as a dictionary or object
                settings = {
                    'calories': result[1],  # Index 1 corresponds to calories_per_day
                    'bedtime': result[2],     # Index 2 corresponds to meals_per_day
                    'wakeupTime': result[3],       # Index 3 corresponds to hours_sleep
                    'sleep': result[4],           # Index 4 corresponds to bedtime
                    'meals': result[5],       # Index 5 corresponds to wakeup_time
                    'notificationsSleep': result[6],  # Index 6 corresponds to notifications_sleep
                    'notificationsMeals': result[7],  # Index 7 corresponds to notifications_meals     
                }
                return settings
            else:
                # Return None or an empty dictionary if no settings are found
                return None
        except psycopg2.Error as e:
            print(f"Database error during getSettings: {e}")
            return None

    def addMeal(self, calories):
        meal_date = date.today()
        try:
            self.db.cursor.execute("""
            SELECT COALESCE(MAX(meal_number), 0)
            FROM meal_logs
            WHERE user_id = %s AND date = %s
        """, (self.id, meal_date))
            max_meal_number = self.db.cursor.fetchone()[0]
            next_meal_number = max_meal_number + 1
            self.db.cursor.execute("""
            INSERT INTO meal_logs (user_id, date, meal_number, calories, created_at)
            VALUES (%s, %s, %s, %s, NOW())
        """, (self.id, meal_date, next_meal_number, calories))
            self.db.conn.commit()

            self.db.cursor.execute("""
            UPDATE daily_logs
            SET total_calories = (
                SELECT COALESCE(SUM(calories), 0)
                FROM meal_logs
                WHERE user_id = %s AND date = %s
            ), meals_count = (
                SELECT COUNT(*)
                FROM meal_logs
                WHERE user_id = %s AND date = %s
            ), updated_at = NOW()
            WHERE user_id = %s AND date = %s
        """, (self.id, meal_date, self.id, meal_date, self.id, meal_date))
            self.db.conn.commit()
            self.checkGoalsMet()

        except psycopg2.Error as e:
            print(f"Database error during addMeal: {e}")
            self.db.conn.rollback()
            return {"error": str(e)}
        
    def ensure_daily_log(self):
        self.db.cursor.execute(
            "SELECT 1 FROM daily_logs WHERE user_id = %s AND date = CURRENT_DATE",
            (self.id,)
        )
        exists = self.db.cursor.fetchone()  

        if not exists:
            self.db.cursor.execute(
                """
                INSERT INTO daily_logs (user_id, date, total_calories, meals_count, sleep_hours, goals_met, streak, updated_at)
                VALUES (%s, CURRENT_DATE, 0, 0, 0, FALSE, 0, NOW())
                """,
                (self.id,)
            )
            self.db.conn.commit()  
    def addSleep(self, bedtime, wakeupTime):
        try:
            bedtime_obj = datetime.strptime(bedtime, "%H:%M")
            wakeupTime_obj = datetime.strptime(wakeupTime, "%H:%M")


            if wakeupTime_obj < bedtime_obj:
                wakeupTime_obj += timedelta(days=1)  


            sleep_duration = (wakeupTime_obj - bedtime_obj).seconds / 3600  # Convert seconds to hours

            self.db.cursor.execute("""
                UPDATE daily_logs
                SET sleep_hours = %s, updated_at = NOW()
                WHERE user_id = %s AND date = CURRENT_DATE
            """, (sleep_duration, self.id))
            self.db.conn.commit()
            self.checkGoalsMet()


            return {"message": "Sleep record added successfully"}
        except Exception as e:
            print(f"Error adding sleep record: {e}")
            return {"error": f"Error adding sleep record: {str(e)}"}
        
    def checkGoalsMet(self):
        try:
            settings = self.getSettings()
            if not settings:
                return

            calorie_goal = settings['calories']
            sleep_goal = settings['sleep']
            meal_goal = settings['meals']

            self.db.cursor.execute("""
                SELECT total_calories, sleep_hours, meals_count
                FROM daily_logs
                WHERE user_id = %s AND date = CURRENT_DATE
            """, (self.id,))
            log = self.db.cursor.fetchone()

            if not log:
                print("Daily log not found")
                return

            current_calories, current_sleep, current_meals = log
            goals_met = (
                current_calories == calorie_goal and
                current_sleep >= sleep_goal and
                current_meals == meal_goal
            )

            if goals_met:
                # Get yesterday's log to determine streak
                self.db.cursor.execute("""
                    SELECT goals_met, streak
                    FROM daily_logs
                    WHERE user_id = %s AND date = CURRENT_DATE - INTERVAL '1 day'
                """, (self.id,))
                yesterday_log = self.db.cursor.fetchone()

                if yesterday_log and yesterday_log[0]:  # goals_met == True
                    new_streak = yesterday_log[1] + 1
                else:
                    new_streak = 1

                # Update today's log with goals_met = True and new streak
                self.db.cursor.execute("""
                    UPDATE daily_logs
                    SET goals_met = TRUE, streak = %s, updated_at = NOW()
                    WHERE user_id = %s AND date = CURRENT_DATE
                """, (new_streak, self.id))
                self.db.conn.commit()
            else:
                # If not met, set goals_met = False and streak = 0
                self.db.cursor.execute("""
                    UPDATE daily_logs
                    SET goals_met = FALSE, streak = 0, updated_at = NOW()
                    WHERE user_id = %s AND date = CURRENT_DATE
                """, (self.id,))
                self.db.conn.commit()

        except psycopg2.Error as e:
            print(f"Database error during checkGoalsMet: {e}")
            self.db.conn.rollback()


        except psycopg2.Error as e:
            print(f"Database error during check_goals_met: {e}")
            self.db.conn.rollback()

    def getDailyLog(self):
        try:
            self.db.cursor.execute("""
                SELECT total_calories, sleep_hours, meals_count, goals_met, streak
                FROM daily_logs
                WHERE user_id = %s AND date = CURRENT_DATE
            """, (self.id,))
            log = self.db.cursor.fetchone()
            if not log:
                print("Daily log not found")
                return None
            log_dict = {
                'total_calories': log[0],
                'sleep_hours': log[1],
                'meals_count': log[2],
                'goals_met': log[3],
                'streak': log[4]
            }
            return log_dict
        except psycopg2.Error as e:
            print(f"Database error during getDailyLog: {e}")
            self.db.conn.rollback()
            return None
        
    def setMood(self, mood):
        self.ensure_daily_log()  

        try:
            self.db.cursor.execute("""
                UPDATE daily_logs
                SET mood = %s, updated_at = NOW()
                WHERE user_id = %s AND date = CURRENT_DATE
            """, (mood, self.user_id))

            self.db.conn.commit()
        except Exception as e:
            self.db.conn.rollback()
            print("Error updating mood:", e)
            
    def getRecentLogs(self, days=5):
        try:
            self.db.cursor.execute("""
                SELECT date, mood, sleep_hours, total_calories
                FROM daily_logs
                WHERE user_id = %s AND date >= CURRENT_DATE - INTERVAL '%s days'
                ORDER BY date DESC
            """, (self.id, days - 1))
            rows = self.db.cursor.fetchall()
            logs = [
                {
                    'date': row[0].isoformat(),
                    'mood': row[1],
                    'sleep_hours': row[2],
                    'calories': row[3]
                }
                for row in rows
            ]
            return logs
        except Exception as e:
            print(f"Error in getRecentLogs: {e}")
            self.db.conn.rollback()
            return []


