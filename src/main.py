import os
import psycopg2

def main():
    db_host = os.getenv("DB_HOST", "localhost")
    db_name = os.getenv("DB_NAME", "bundlwise_db")
    db_user = os.getenv("DB_USER", "bundlwise_user")
    db_pass = os.getenv("DB_PASS", "bundlwise_pass")

    print(f"Connecting to DB: host={db_host}, dbname={db_name}, user={db_user}")

    try:
        conn = psycopg2.connect(
            host=db_host,
            dbname=db_name,
            user=db_user,
            password=db_pass
        )
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
        tables = cur.fetchall()
        print("Tables in DB:", tables)

        cur.close()
        conn.close()
        print("DB connection successful!")
    except Exception as e:
        print(f"Error connecting to DB: {e}")

if __name__ == "__main__":
    main()