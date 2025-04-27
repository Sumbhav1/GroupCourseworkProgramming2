from ..db import Database
from flask import jsonify
import bcrypt
import psycopg2 


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
                    'meals': result[2],     # Index 2 corresponds to meals_per_day
                    'sleep': result[3],       # Index 3 corresponds to hours_sleep
                    'bedtime': result[4],           # Index 4 corresponds to bedtime
                    'wakeupTime': result[5],       # Index 5 corresponds to wakeup_time
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






