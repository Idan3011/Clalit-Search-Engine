import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
load_dotenv()


host = os.getenv('HOST')
user = os.getenv('USER')
password = os.getenv('PASSWORD')
database = os.getenv('DATABASE')


csv_file_path='./data.csv'


df = pd.read_csv(csv_file_path, encoding='utf-8')

table_name = 'Clalit Search'
engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{database}')

df.to_sql(name=table_name, con=engine, if_exists='replace', index=False)

print(f'DataFrame successfully exported to MySQL table: {table_name}')
