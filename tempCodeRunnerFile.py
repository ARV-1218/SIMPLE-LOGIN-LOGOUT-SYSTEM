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