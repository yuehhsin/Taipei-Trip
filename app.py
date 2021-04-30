import json,ssl,mysql.connector
from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"] = False
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

#### connect MySQL ###
mydb=mysql.connector.connect(
	host="localhost",
	user="root",
<<<<<<< HEAD
	password="kelly7991",
=======
	password="KElly_1234",
>>>>>>> 81caf6cb58b6d3566c7fa5c43ba5e666d51dbc32
	database="gov_data",
	charset="utf8",
)
cursor = mydb.cursor()
cursor.execute("SELECT COUNT(id) FROM taipei_attractions")
lengthData = int(cursor.fetchone()[0]) #資料總長度:lengthData

### Pages ###
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

#### API ###
@app.route("/api/attractions")
def getAttBYPageKeyword():
	page_args = request.args.get("page") #取得前端參數:page
	keyword = request.args.get("keyword") #取得前端參數:keyword
	# 定義函式:處理資料查詢
	def result(resultData):
		image_list = resultData[9].split(",")
		image_list.pop(-1) #刪掉多餘的物件
		data = {
			"id": resultData[0],
			"name": resultData[1],
			"category": resultData[2],
			"description": resultData[3],
			"address": resultData[4],
			"transport": resultData[5],
			"mrt": resultData[6],
			"latitude": resultData[7],
			"longitude": resultData[8],
			"images": image_list
		}
		data_list.append(data)
	# 定義函式:處理nextpage
	def nextPage(page):
		if page==lengthData//12:
			nextpage.append(None) 
		else:
			nextpage.append(page+1)
	
	if page_args.isdigit()==True:
		page = int(page_args)
		if page>=0 and page<=lengthData//12:
			# 使用page查詢!
			data_list = []
			nextpage = []
			if keyword==None:	
				if page==lengthData//12: # 處理最後一頁的資料
					end = lengthData
				else:
					end = (page+1)*12

				start = page*12
				cursor.execute(f"SELECT * FROM taipei_attractions LIMIT {start},12")
				resultall = cursor.fetchall()
				for resultData in resultall:
					result(resultData)
				nextPage(page)
			# 使用keyword查詢!
			else:
				cursor.execute(f'SELECT COUNT(*) FROM taipei_attractions WHERE name LIKE "%{keyword}%" OR category LIKE "%{keyword}%" OR description LIKE "%{keyword}%" OR address LIKE "%{keyword}%" OR mrt LIKE "%{keyword}%"')
				search_length = cursor.fetchone()
				searches = search_length[0]
				search_page = searches//12-1
				begin = page*12
				if searches%12!=0 and page==search_page+1 : #最後一頁
					end = searches%12
				elif searches%12!=0 and page>search_page+1 or searches%12==0 and page>search_page: #處理超過搜尋的頁數
					error = {
						"error": True,
						"message": "超過搜尋結果"
					}
					return jsonify(error),400
				else:
					end = 12
				cursor.execute(f'SELECT * FROM taipei_attractions WHERE name LIKE "%{keyword}%" OR category LIKE "%{keyword}%" OR description LIKE "%{keyword}%" OR address LIKE "%{keyword}%" OR mrt LIKE "%{keyword}%" LIMIT {begin},{end}')
				resultall = cursor.fetchall()
				for resultData in resultall:
					result(resultData)
				nextPage(page)
			result = {
				"nextPage": nextpage[0],
				"data": data_list
			}
			return jsonify(result),200
		else: #ERROR_400:page超過有效範圍
			error = {
				"error": True,
				"message": "請輸入有效頁碼"
			}
			return jsonify(error),400			
	else: #ERROR_400:page非數字
		error = {
			"error": True,
			"message": "請輸入有效數值"
		}
		return jsonify(error),400

@app.route("/api/attraction/<path:attractionId>") # 使用id查詢!
def getAttBYid(attractionId):
	if attractionId.isdigit()==True: # 判定id是否為數字
		serchId = int(attractionId)
		if serchId>0 and serchId<=lengthData: # id介於有效範圍
			cursor.execute(f"SELECT * FROM taipei_attractions WHERE id={serchId}")
			resultData = cursor.fetchone()
			image_list = resultData[9].split(",")
			image_list.pop(-1)
			data = {
				"id": resultData[0],
				"name": resultData[1],
				"category": resultData[2],
				"description": resultData[3],
				"address": resultData[4],
				"transport": resultData[5],
				"mrt": resultData[6],
				"latitude": resultData[7],
				"longitude": resultData[8],
				"images": image_list
			}
			result = {
				"data": data
			}
			return jsonify(result),200
		else: #ERROR_400:id超過有效範圍
			error = {
				"error": True,
				"message": "請輸入有效數值"
			}
			return jsonify(error),400
	else: #ERROR_400:id非數字
		error = {
			"error": True,
			"message": "請輸入有效數值"
		}
		return jsonify(error),400

@app.errorhandler(500) #ERROR_500:伺服器內部錯誤
def handle_500(e):
	error = {
		"error": True,
		"message": "伺服器內部錯誤"
	}
	return jsonify(error),500

app.run(host="0.0.0.0",port=3000)
