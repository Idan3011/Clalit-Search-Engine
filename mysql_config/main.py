import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

# Connection to MySQL
host = os.getenv('HOST')
user = os.getenv('USER')
password = os.getenv('PASSWORD')
database = os.getenv('DATABASE')

csv_file_path='./data.csv'

table_name = 'Clalit_Search'
columns = [
    'תאור התמחות', 'תאור הנחיה', 'מספר רופא', 'שם רופא', 'תאור אתר'
]
chunk_size = 10000 
chunks = pd.read_csv(csv_file_path, encoding='ISO-8859-8', chunksize=chunk_size, usecols=columns)


engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{database}')

for chunk in chunks:
     chunk.to_sql(name=table_name, con=engine, if_exists='append', index=False)

print(f'DataFrame successfully exported to MySQL table: {table_name}')
