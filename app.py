import json,ssl,mysql.connector
from flask import * 
from flask import session
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"] = False
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

#### session ####
app.secret_key = "hello"

#### Blueprint ####
from route.page.page import page
from route.api.user import user
from route.api.attractions import att
from route.api.booking import book

app.register_blueprint(page)
app.register_blueprint(user,url_prefix='/api')
app.register_blueprint(att,url_prefix='/api')
app.register_blueprint(book,url_prefix='/api')


if __name__ == "__main__":
	app.run(host="0.0.0.0",port=3000,debug=True)
