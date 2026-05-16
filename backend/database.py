from peewee import *
import datetime
import os

db_path = os.path.join(os.path.dirname(__file__), 'keyshield.db')
db = SqliteDatabase(db_path)

class BaseModel(Model):
    class Meta:
        database = db

class Threat(BaseModel):
    process_name = CharField()
    pid = IntegerField()
    risk_level = CharField() # Low, Medium, High
    risk_score = IntegerField()
    timestamp = DateTimeField(default=datetime.datetime.now)
    action_taken = CharField(default='Detected') # Detected, Terminated, Ignored
    details = TextField(null=True)

class Log(BaseModel):
    event_type = CharField() # Scan, Threat, System
    message = TextField()
    timestamp = DateTimeField(default=datetime.datetime.now)

class TrustedApp(BaseModel):
    process_name = CharField(unique=True)
    added_at = DateTimeField(default=datetime.datetime.now)

def init_db():
    db.connect()
    db.create_tables([Threat, Log, TrustedApp])
    print("Database initialized.")

if __name__ == "__main__":
    init_db()
