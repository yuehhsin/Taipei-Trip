import json
import ssl
import mysql.connector
import requests
from database.mySQL import *
from flask import Blueprint, jsonify, request
from flask import session
orders = Blueprint("orders", __name__)

@orders.route("/orders", methods=["POST"])
def newOrder():
    mydb = dbpool.get_connection()
    cursor = mydb.cursor()
    try:
        if("id" in session):
            frontData = request.get_json()
            print(frontData["orderInfo"])
            myData = json.dumps({
                "prime": frontData["prime"],
                "partner_key": "partner_oQcae5ByXIn3kNCRlSOGhYIhP2h4Ja5TSvYTuFTY9Ekj6liAGKYVQ1VZ",
                "merchant_id": "yuehhsin_ESUN",
                "details": "Taipei Trip Test",
                "amount": int(frontData["orderInfo"]["price"]),
                "cardholder": {
                    "phone_number": frontData["customer"]["phone"],
                    "name": frontData["customer"]["name"],
                    "email": frontData["customer"]["email"],
                },
                "remember": False
            })
            headers = {
                "Content-Type": "application/json",
                "x-api-key": "partner_oQcae5ByXIn3kNCRlSOGhYIhP2h4Ja5TSvYTuFTY9Ekj6liAGKYVQ1VZ"
            }
            response = requests.post(
                'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', data=myData, headers=headers)
            # 付款成功
            if (response.json()["status"] == 0):
                orderedInfo = {  # 成功下訂的資料
                    "userId": session["id"],
                    "number": response.json()["rec_trade_id"],
                    "price": response.json()["amount"],
                    "attId": frontData["orderInfo"]["att"]["attId"],
                    "attName": frontData["orderInfo"]["att"]["attName"],
                    "attAddress": frontData["orderInfo"]["att"]["attAddress"],
                    "attImage": frontData["orderInfo"]["att"]["attImage"],
                    "tripDate": frontData["orderInfo"]["date"],
                    "tripTime": frontData["orderInfo"]["time"],
                    "contactName": frontData["customer"]["name"],
                    "contactEmail": frontData["customer"]["email"],
                    "contactPhone": frontData["customer"]["phone"],
                    "status": 0
                }
                # 將訂單資料加進資料庫(bookedInfo)
                value = (orderedInfo["userId"], orderedInfo["number"], orderedInfo["price"], orderedInfo["attId"], orderedInfo["attName"], orderedInfo["attAddress"], orderedInfo["attImage"],
                         orderedInfo["tripDate"], orderedInfo["tripTime"], orderedInfo[
                             "contactName"], orderedInfo["contactEmail"], orderedInfo["contactPhone"], 0
                         )
                insert = "INSERT INTO bookedInfo (userId,number,price,attId,attName,attAddress,attImage,tripDate,tripTime,contactName,contactEmail,contactPhone,status) VALUES {}".format(
                    value)
                cursor.execute(insert)
                mydb.commit()
                mydb.close()
                return jsonify({
                    "data": {
                        "number": orderedInfo["number"],
                        "payment": {
                            "status": 0,
                            "message": "付款成功"
                        }
                    }
                }
                ), 200
            else:
                mydb.close()
                print(response.json()["status"], response.json()["msg"])
                return jsonify({
                    "error": True,
                    "message": response.json()["msg"]
                }), 400
        else:
            return jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
            }), 403
    except mysql.connector.Error as err:
        mydb.close()
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500

# 根據訂單編號取得訂單資訊
@orders.route("/orders/<path:number>", methods=["GET"])
def searchOrder(number):
    mydb = dbpool.get_connection()
    cursor = mydb.cursor()
    try:
        if "id" in session:
            cursor.execute(f"SELECT * FROM bookedInfo WHERE number='{number}'")
            bookedInfo = cursor.fetchone()
            mydb.close()
            return jsonify({
                "data": {
                    "number": bookedInfo[2],
                    "price": bookedInfo[3],
                    "trip": {
                        "attraction": {
                            "id": bookedInfo[4],
                            "name": bookedInfo[5],
                            "address": bookedInfo[6],
                            "image": bookedInfo[7]
                        },
                        "date": bookedInfo[8],
                        "time": bookedInfo[9]
                    },
                    "contact": {
                        "name": bookedInfo[10],
                        "email": bookedInfo[11],
                        "phone": bookedInfo[12]
                    },
                    "status": 0
                }
            }), 200
        else:
            mydb.close()
            return jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
            }), 403
    except mysql.connector.Error as err:
        mydb.close()
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
