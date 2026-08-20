from app import app, db
from sqlalchemy import text

with app.app_context():
    print("🔍 Verificando columnas existentes...")
    
    # Verificar columnas actuales
    columnas = db.session.execute(text("PRAGMA table_info(equipo)")).fetchall()
    columnas_existentes = [col[1] for col in columnas]
    print(f"📋 Columnas existentes: {len(columnas_existentes)}")
    
    # ====== AGREGAR COLUMNAS FALTANTES ======
    nuevas_columnas = []
    
    if 'fecha_certificado_contrastacion' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN fecha_certificado_contrastacion DATE'))
        nuevas_columnas.append('fecha_certificado_contrastacion')
        print("✅ fecha_certificado_contrastacion agregada")
    
    if 'nro_informe_contrastacion' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN nro_informe_contrastacion VARCHAR(100)'))
        nuevas_columnas.append('nro_informe_contrastacion')
        print("✅ nro_informe_contrastacion agregada")
    
    if 'fecha_certificado_mantencion' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN fecha_certificado_mantencion DATE'))
        nuevas_columnas.append('fecha_certificado_mantencion')
        print("✅ fecha_certificado_mantencion agregada")
    
    if 'nro_informe_mantencion' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN nro_informe_mantencion VARCHAR(100)'))
        nuevas_columnas.append('nro_informe_mantencion')
        print("✅ nro_informe_mantencion agregada")
    
    if 'fecha_despacho' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN fecha_despacho DATE'))
        nuevas_columnas.append('fecha_despacho')
        print("✅ fecha_despacho agregada")
    
    if 'nro_certificado_termometro' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN nro_certificado_termometro VARCHAR(100)'))
        nuevas_columnas.append('nro_certificado_termometro')
        print("✅ nro_certificado_termometro agregada")
    
    if 'fecha_contrastacion_termometro' not in columnas_existentes:
        db.session.execute(text('ALTER TABLE equipo ADD COLUMN fecha_contrastacion_termometro DATE'))
        nuevas_columnas.append('fecha_contrastacion_termometro')
        print("✅ fecha_contrastacion_termometro agregada")
    
    db.session.commit()
    
    # ====== MOSTRAR RESULTADO FINAL ======
    if nuevas_columnas:
        print(f"\n🎉 {len(nuevas_columnas)} columnas agregadas correctamente:")
        for col in nuevas_columnas:
            print(f"   - {col}")
    else:
        print("\n✅ Todas las columnas ya existen. No se requirieron cambios.")
    
    # Mostrar todas las columnas actuales
    print("\n📋 Columnas actuales en la tabla equipo:")
    columnas = db.session.execute(text("PRAGMA table_info(equipo)")).fetchall()
    for col in columnas:
        print(f"   - {col[1]} ({col[2]})")