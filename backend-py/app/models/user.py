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
        finally:
            self.db.close()
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

            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
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



