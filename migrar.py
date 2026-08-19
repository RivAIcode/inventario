from app import app, db
from sqlalchemy import text

try:
    with app.app_context():
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN nro_informe VARCHAR(100)'))
        db.session.commit()
        print("✅ Columna 'nro_informe' agregada")
except Exception as e:
    print(f"⚠️ Error: {e}")