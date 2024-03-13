import pandas as pd
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
from crontab import CronTab
import gzip

def update_mysql_table():
    csv_file_path = os.getenv('CSV_FILE_PATH')

    if not os.path.exists(csv_file_path):
        print(f'File not found: {csv_file_path}, please make sure the file exists. Exiting...')
        exit()

    load_dotenv(override=True)

    # Connection to MySQL
    host = os.getenv('HOST')
    user = os.getenv('USER')
    password = os.getenv('PASSWORD')
    database = os.getenv('DATABASE')

    table_name = 'Clalit_Search'
    columns_mapping = {
        'קוד התמחות': 'קוד התמחות',
        'תאור התמחות': 'תאור התמחות',
        'תאור הנחיה': 'הנחיות ללקוח',
        'שם רופא': 'שם רופא',
        'תאור אתר': 'שם מרפאה',
        'תאור הצגה לגורם': 'תאור הצגה לגורם',
        "סוג הנחיה": "סוג הנחיה",
    }

    # Specify the desired order of columns
    desired_columns_order = [
        "הנחיות ללקוח", 
        "שם מרפאה", 
        "שם רופא", 
        "קוד התמחות",
        "סוג הנחיה",
        "תאור התמחות"
    ]

    # Define a function to dynamically determine the number of rows to skip
    def determine_skip_rows(csv_file_path):
        with gzip.open(csv_file_path, 'rt', encoding='ISO-8859-8') as file:
            for i, line in enumerate(file):
                if line.strip() and 'דוח מאפייני יומן עם הנחיות' in line:
                    return i + 2  # Skip the first two lines containing the specified text
        return 0  # If the file is empty or the specified text is not found, return 0

    skiprows = determine_skip_rows(csv_file_path)

    # Create SQLAlchemy engine
    engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{database}')

    # Define the SQL CREATE TABLE statement with the desired column order
    create_table_query = text(f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        `הנחיות ללקוח` VARCHAR(1024),
        `שם מרפאה` VARCHAR(1024),
        `שם רופא` VARCHAR(1024),
        `קוד התמחות` VARCHAR(1024),
        `סוג הנחיה` VARCHAR(1024),
        `תאור התמחות` VARCHAR(1024)
    )
    """)

    # Execute the CREATE TABLE query
    with engine.connect() as connection:
        connection.execute(create_table_query)

    # Read CSV file in chunks and export to MySQL
    chunk_size = 10000 
    for chunk in pd.read_csv(csv_file_path, compression='gzip', encoding='ISO-8859-8', chunksize=chunk_size, skiprows=skiprows, usecols=columns_mapping.keys()):
        # Filter the DataFrame based on 'תאור הצגה לגורם' column where value is 'לקוח'
        filtered_chunk = chunk[chunk['תאור הצגה לגורם'].str.strip() == 'לקוח']
        
        # Rename columns
        filtered_chunk = filtered_chunk.rename(columns=columns_mapping)
        
        # Reorder columns
        filtered_chunk = filtered_chunk[desired_columns_order]
        
        # Export filtered_chunk to MySQL
        filtered_chunk.to_sql(name=table_name, con=engine, if_exists='append', index=False)

    print(f'DataFrame successfully exported to MySQL table: {table_name}')



if __name__ == "__main__":
    update_mysql_table()
   
