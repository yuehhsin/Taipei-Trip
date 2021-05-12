###### /api/user ######
import json,ssl,mysql.connector
from flask import Blueprint,jsonify,request
user = Blueprint("user", __name__)

mydb=mysql.connector.connect(
	host="localhost",
	user="root",
	password="KElly_7991",
	database="gov_data",
	charset="utf8",
)
cursor = mydb.cursor()

memberList=[]
@user.route("/user",methods=["POST"])
def userSignup():
	data = request.get_json()
	name = data["name"]
	email = data["email"]
	password = data["password"]
	if name!="" and email!="" and password!="":
		try:
			command = "SELECT * FROM members WHERE email=%s"
			cursor.execute(command,(email,))
			comfirmEmail = cursor.fetchall()
			if (len(comfirmEmail)==0):
				cursor.execute(
					"INSERT INTO members(name,email,password) VALUE(%s,%s,%s)"
					,(name,email,password)
				)
				mydb.commit()
				return jsonify({"ok": True}),200
			else:
				return jsonify({
					"error": True,
					"message": "信箱已被使用"
				}),400
		except mysql.connector.Error as err:
			return jsonify({
				"error": True,
				"message": "伺服器內部錯誤"
				}), 500

@user.route("/user",methods=["PATCH"])
def userSignin():
	data = request.get_json()
	email = data["email"]
	password = data["password"]
	cursor.execute("SELECT COUNT(*) FROM members WHERE email=%s AND password=%s",(email,password))
	checkSQL = cursor.fetchone()[0]

	try:
		if checkSQL==1:
			#在memberList紀錄會員資訊
			cursor.execute("SELECT id,name FROM members WHERE email=%s AND password=%s",(email,password))
			memberData = cursor.fetchone()
			memberList.append(memberData[0])
			memberList.append(memberData[1])
			memberList.append(email)
			return jsonify({
				"ok": True
			}),200
		else:
			return jsonify({
				"error": True,
				"message": "密碼或帳號錯誤"
			}),400
	except mysql.connector.Error as err:
		return jsonify({
			"error": True,
			"message": "伺服器內部錯誤"
			}), 500		

@user.route("/user",methods=["GET"])
def userStatus():
	if (memberList==[]):
		return jsonify({
			"data":{
				"id": None,
				"name": None,
				"email": None
			}
		}),200
	else:
		return jsonify({
			"data":{
				"id": memberList[0],
				"name": memberList[1],
				"email": memberList[2]
			}
		}),200		

@user.route("/user",methods=["DELETE"])
def userLogout():
	memberList.clear()
	return jsonify({
		"ok": True
	}),200