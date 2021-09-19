import json
import ssl
import mysql.connector
from flask import Blueprint, jsonify, request
from database.mySQL import *
from flask import session
user = Blueprint("user", __name__)

mydb = dbpool.get_connection()
cursor = mydb.cursor()
cursor.execute("SELECT COUNT(id) FROM taipei_attractions")


@user.route("/user", methods=["POST"])  # 註冊
def userSignup():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]
    if name != "" and email != "" and password != "":
        try:
            command = "SELECT * FROM members WHERE email=%s"
            cursor.execute(command, (email,))
            comfirmEmail = cursor.fetchall()
            if (len(comfirmEmail) == 0):
                cursor.execute(
                    "INSERT INTO members(name,email,password) VALUE(%s,%s,%s)", (
                        name, email, password)
                )
                mydb.commit()
                return jsonify({"ok": True}), 200
            else:
                return jsonify({
                    "error": True,
                    "message": "信箱已被使用"
                }), 400
        except mysql.connector.Error as err:
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            }), 500


@user.route("/user", methods=["PATCH"])  # 登入
def userSignin():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    cursor.execute(
        "SELECT COUNT(*) FROM members WHERE email=%s AND password=%s", (email, password))
    checkSQL = cursor.fetchone()[0]
    try:
        if checkSQL == 1:
            # 在memberList紀錄會員資訊
            cursor.execute(
                "SELECT id,name FROM members WHERE email=%s AND password=%s", (email, password))
            memberData = cursor.fetchone()
            session["id"] = memberData[0]
            session["name"] = memberData[1]
            session["email"] = email
            return jsonify({
                "ok": True
            }), 200
        else:
            return jsonify({
                "error": True,
                "message": "密碼或帳號錯誤"
            }), 400
    except mysql.connector.Error as err:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500


@user.route("/user", methods=["GET"])  # 會員狀態
def userStatus():
    if "id" in session:
        return jsonify({
            "data": {
                "id": session["id"],
                "name": session["name"],
                "email": session["email"]
            }
        }), 200
    else:
        return jsonify({
            "data": {
                "id": None,
                "name": None,
                "email": None
            }
        }), 200


@user.route("/user", methods=["DELETE"])  # 登出
def userLogout():
    session.pop("id", None)
    session.pop("name", None)
    session.pop("email", None)
    return jsonify({
        "ok": True
    }), 200
