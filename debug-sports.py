#!/usr/bin/env python3
"""
Script de diagnóstico para sports-svc
"""
import os
import sys

print("=== DIAGNÓSTICO SPORTS-SVC ===")
print(f"Python version: {sys.version}")
print(f"Environment variables:")
print(f"  MYSQL_HOST: {os.getenv('MYSQL_HOST', 'NOT SET')}")
print(f"  MYSQL_USER: {os.getenv('MYSQL_USER', 'NOT SET')}")
print(f"  MYSQL_DATABASE: {os.getenv('MYSQL_DATABASE', 'NOT SET')}")
print(f"  MYSQL_PASSWORD: {'SET' if os.getenv('MYSQL_PASSWORD') else 'NOT SET'}")

# Test connection
try:
    from sqlalchemy import create_engine, text
    
    DB_URL = (
        f"mysql+pymysql://{os.getenv('MYSQL_USER', 'campus')}"
        f":{os.getenv('MYSQL_PASSWORD', 'campus')}@mysql:3306/{os.getenv('MYSQL_DATABASE', 'campuswell')}"
    )
    
    print(f"DB_URL: {DB_URL.replace(os.getenv('MYSQL_PASSWORD', 'campus'), '***')}")
    
    # Test without any connect_args
    print("Testing connection without connect_args...")
    engine = create_engine(DB_URL, pool_pre_ping=True)
    
    with engine.begin() as cn:
        result = cn.execute(text("SELECT 1 as test"))
        test_result = result.fetchone()
        print(f"✅ Connection successful: {test_result[0]}")
        
        # Check tables
        tables = cn.execute(text("SHOW TABLES")).fetchall()
        table_names = [list(row.values())[0] for row in tables]
        print(f"Tables found: {table_names}")
        
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()
