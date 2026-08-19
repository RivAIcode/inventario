#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, ConfiguracionCorreo
from app import enviar_alertas_automatico, get_chile_time

with app.app_context():
    config = ConfiguracionCorreo.query.first()
    if not config:
        print("❌ No hay configuración de correos")
        sys.exit(1)
    
    if not config.activo:
        print("❌ Envíos automáticos desactivados en configuración")
        sys.exit(0)
    
    ahora = get_chile_time()
    hora_config = config.hora_envio.split(':')
    hora_actual = ahora.hour
    minuto_actual = ahora.minute
    
    # Verificar si es hora de enviar (margen de 5 minutos)
    hora_esperada = int(hora_config[0])
    minuto_esperado = int(hora_config[1])
    
    if hora_actual == hora_esperada and minuto_actual >= minuto_esperado:
        print(f"⏰ Ejecutando envío automático a las {hora_actual}:{minuto_actual} (hora configurada: {hora_esperada}:{minuto_esperado})")
        enviar_alertas_automatico()
        print("✅ Envío completado")
    else:
        print(f"⏰ No es hora de enviar. Hora actual: {hora_actual}:{minuto_actual}, Hora configurada: {hora_esperada}:{minuto_esperado}")