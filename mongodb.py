import pymongo

myClient = pymongo.MongoClient("mongodb://localhost:27017")
myDb = myClient["chat_doubleP"] 
myCollection = myDb["mensajes"]

