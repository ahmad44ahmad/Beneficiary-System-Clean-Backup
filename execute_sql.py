import os
import psycopg2

# Configuration
DB_HOST = "db.ruesovrbhcjphmfdcpsa.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "aDgzkaH9Pq5QUdt4"
DB_PORT = "5432"

FILES_TO_EXECUTE = [
    "001_core_schema.sql",
    "002_functions.sql"
]

def execute_sql_file(conn, filename):
    print(f"Executing {filename}...")
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            sql_content = f.read()
            
        with conn.cursor() as cur:
            cur.execute(sql_content)
        conn.commit()
        print(f"✅ Successfully executed {filename}")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error executing {filename}: {e}")
        raise

def main():
    print("Connecting to Supabase Database...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        print("✅ Connected to Database.")
        
        for filename in FILES_TO_EXECUTE:
            if os.path.exists(filename):
                try:
                    execute_sql_file(conn, filename)
                except:
                    print("Stopping execution due to error.")
                    break
            else:
                print(f"⚠️ File not found: {filename}")
                
        conn.close()
        print("Done.")
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("Please check the password and internet connection.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
