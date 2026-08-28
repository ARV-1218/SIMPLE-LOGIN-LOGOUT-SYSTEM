from flask import Flask, render_template, redirect, request, jsonify, url_for, session
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key = "some-secret-key"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "auth.db")

# DB initialization
def initDB():
    try:
    
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL
        )""")
        
        conn.commit()
        return ("success")     
    except sqlite3.Error as error:
        print("Error occured", error)
    finally:
        cursor.close()
        conn.close()
    
# DB Setup    
@app.route("/setup_db")
def setup_db():
    init = initDB()
    if init == "success":
        return jsonify("Database Initialized")
    else:
          return jsonify("Database Error OCcured :( ")
      
#home page
@app.route("/")
def home():
    return render_template("index.html")

#LOGIN
@app.route("/login",methods=['POST','GET'])
def login():
    if request.method == 'POST':
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            data = request.get_json()
            
            cursor.execute("""SELECT * FROM users
                        WHERE username=?""",(data["username"],))
            rows = cursor.fetchone()
            if rows:
                if check_password_hash(rows[2],data["password"]):
                    session["user_id"] = rows[0]
                    
                    return redirect(url_for("admin"))
                else:
                    return jsonify({"message":"Invalid credentials"})
            else:
                return jsonify({"message":"access denied"})
        except sqlite3.Error as error:
            print("Error occured", error)
        finally:
            cursor.close()
            conn.close()
    elif request.method == "GET":
        return render_template("/signin.html")
     
#register
@app.route("/register", methods=["POST", "GET"])
def register():

    if request.method == "GET":
        return render_template("register.html")

    try:
        data = request.get_json()

        username = data["username"]
        passW = data["password"]

        if not username or not passW:
            return jsonify({"message": "Username and password required"}), 400

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        hashpass = generate_password_hash(passW)
        cursor.execute("""
            INSERT INTO users(username, password_hash)
            VALUES(?, ?)
        """, (username, hashpass))

        conn.commit()
        
       

        print(data)

        return redirect(url_for("login"))

    except sqlite3.Error as error:
        print("Error occurred:", error)
        return jsonify({"message": "Database error"}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
@app.route("/admin",methods = ['GET'])
def admin(): 
    if session.get("user_id"):
    
     return render_template("dashboard.html")
    return redirect("/")
if __name__ == "__main__":
    initDB()
    app.run(debug=True)