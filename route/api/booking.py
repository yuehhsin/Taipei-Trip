import json,ssl,mysql.connector,datetime
from database.mySQL import *
from flask import Blueprint,jsonify,request,session

book = Blueprint("booking", __name__)

booking = {
    "attractionId": None,
    "date": None,
    "time": None,
    "price": None,
}

@book.route("/booking",methods=["GET"]) #取得尚未確認下單的預定行程
def getBookinfo():
    try:
        if(session["id"]):
            Id = booking["attractionId"]
            if (Id==None):
                return jsonify({
                "data":{
                    "attraction":{
                        "id": None,
                        "name": None,
                        "address": None,
                        "image": None,
                    },
                    "date": None,
                    "time": None,
                    "price": None,
                }            
                })
            else:
                print(booking)
                cursor.execute(f"SELECT name,address,images FROM taipei_attractions WHERE id={Id}")
                data = cursor.fetchall()[0]
                return jsonify({
                    "data":{
                        "attraction":{
                            "id": Id,
                            "name": data[0],
                            "address": data[1],
                            "image": data[2].split(",")[0],
                        },
                        "date": booking["date"],
                        "time": booking["time"],
                        "price": booking["price"],
                    }
                })
    except:
        return jsonify({
            "error": True,
            "message": "未登入系統，拒絕存取"
        })

@book.route("/booking",methods=["POST"]) #建立新的預定行程
def newBook():
    data = request.get_json()
    today = datetime.date.today()
    date = data["date"].split("-")
    selDate = datetime.date(int(date[0]),int(date[1]),int(date[2]))
    global booking
    booking = {
        "attractionId": data["attractionId"],
        "date": data["date"],
        "time": data["time"],
        "price": data["price"],
    }
    try:
        if(session["id"]):
            try:
                date = data["date"].split("-")
                if (data["attractionId"]==""):
                    return jsonify({
                        "error": True,
                        "message": "景點資料錯誤"
                    }),400
                elif (today>=selDate):
                    return jsonify({
                        "error": True,
                        "message": "預約日期已過"
                    }),400
                elif (data["time"]==""):
                    return jsonify({
                        "error": True,
                        "message": "未選擇時段"
                    }),400
                elif (int(data["price"])<0):
                    return jsonify({
                        "error": True,
                        "message": "系統價格錯誤 請聯繫客服"
                    }),400
                else:
                    return jsonify({  #預定成功!
                        "ok": True
                    }),200
            except mysql.connector.Error as err:
                return  jsonify({
                    "error": True,
                    "message": "伺服器內部錯誤"
                }),500
    except:
        return jsonify({
            "error": True,
            "message": "未登入系統，拒絕存取"
        }),403
    
@book.route("/booking",methods=["DELETE"]) #刪除目前的預定行程
def deleteBook():
    try:
        if(session["id"]):
            try:
                global booking
                booking={
                    "attractionId": None,
                    "date": None,
                    "time": None,
                    "price": None,
                }
                return jsonify({
                    "ok": True
                })
            except mysql.connector.Error as err:
                return  jsonify({
                    "error": True,
                    "message": "伺服器內部錯誤"
                }),500
    except:
        return jsonify({
            "error": True,
            "message": "未登入系統，拒絕存取"
        }),403        