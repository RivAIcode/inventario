// ==================== main.js - VERSION LIMPIA ====================

function sortTable(n) {
    let table = document.getElementById("tablaEquipos");
    if (!table) return;
    let rows = table.rows;
    let switching = true;
    let dir = "asc";
    while (switching) {
        switching = false;
        for (let i = 1; i < rows.length - 1; i++) {
            let x = rows[i].getElementsByTagName("TD")[n];
            let y = rows[i + 1].getElementsByTagName("TD")[n];
            if (x && y) {
                let xVal = x.innerText.toLowerCase();
                let yVal = y.innerText.toLowerCase();
                if ((dir === "asc" && xVal > yVal) || (dir === "desc" && xVal < yVal)) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    break;
                }
            }
        }
        if (switching === false && dir === "asc") {
            dir = "desc";
            switching = true;
        }
    }
}

function buscarEquipo() {
    let input = document.getElementById('search');
    if (!input) return;
    let filter = input.value.toLowerCase();
    let table = document.getElementById('tablaEquipos');
    if (!table) return;
    let rows = table.getElementsByTagName('tr');
    let count = 0;
    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let found = false;
        for (let j = 0; j < cells.length - 1; j++) {
            if (cells[j] && cells[j].innerText.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        rows[i].style.display = found ? '' : 'none';
        if (found) count++;
    }
    let contador = document.getElementById('contador');
    if (contador) contador.innerText = 'Mostrando ' + count + ' de ' + (rows.length - 1) + ' equipos';
}

window.equipoIdActual = null;

function cambiarEstadoCompleto(equipoId, estadoActual) {
    window.equipoIdActual = equipoId;
    let equipoIdInput = document.getElementById('cambio_equipo_id_modal');
    if (equipoIdInput) equipoIdInput.value = equipoId;
    
    let nuevoEstado = document.getElementById('cambio_nuevo_estado_modal');
    if (nuevoEstado) nuevoEstado.value = '';
    
    let responsable = document.getElementById('cambio_responsable_modal');
    if (responsable) responsable.value = '';
    
    let servicio = document.getElementById('cambio_servicio_tecnico_modal');
    if (servicio) servicio.value = '';
    
    let fechaContrastacion = document.getElementById('cambio_fecha_contrastacion_modal');
    if (fechaContrastacion) fechaContrastacion.value = '';
    
    let fechaEnvio = document.getElementById('cambio_fecha_envio_modal');
    if (fechaEnvio) fechaEnvio.value = '';
    
    let divResponsable = document.getElementById('div_responsable_cambio_modal');
    if (divResponsable) divResponsable.style.display = 'none';
    
    let divServicio = document.getElementById('div_servicio_tecnico_modal');
    if (divServicio) divServicio.style.display = 'none';
    
    let divFecha = document.getElementById('div_fecha_contrastacion_modal');
    if (divFecha) divFecha.style.display = 'none';
    
    let divFechaEnvio = document.getElementById('div_fecha_envio_modal');
    if (divFechaEnvio) divFechaEnvio.style.display = 'none';
    
    let estadoActualSpan = document.getElementById('estado_actual_texto');
    if (estadoActualSpan) {
        estadoActualSpan.textContent = estadoActual;
        let color = '#666';
        if (estadoActual === 'Operativo') color = '#4CAF50';
        else if (estadoActual === 'Mantencion') color = '#FF9800';
        else if (estadoActual === 'Prestado') color = '#2196F3';
        else if (estadoActual === 'Volante') color = '#9C27B0';
        else if (estadoActual === 'Contrastacion') color = '#00BCD4';
        else if (estadoActual === 'Fuera de Servicio') color = '#f44336';
        
        estadoActualSpan.style.backgroundColor = color;
        estadoActualSpan.style.color = 'white';
        estadoActualSpan.style.padding = '3px 8px';
        estadoActualSpan.style.borderRadius = '4px';
    }
    
    let modal = document.getElementById('modalCambioEstado');
    if (modal) modal.style.display = 'block';
}

function cerrarModalEstado() {
    let modal = document.getElementById('modalCambioEstado');
    if (modal) modal.style.display = 'none';
}

function eliminarMultiples() {
    let checkboxes = document.querySelectorAll('.select-equipo:checked');
    if (checkboxes.length === 0) {
        alert('Seleccione al menos un equipo');
        return;
    }
    if (confirm('¿Eliminar ' + checkboxes.length + ' equipos?')) {
        let ids = [];
        checkboxes.forEach(function(cb) {
            ids.push(cb.value);
        });
        let form = document.createElement('form');
        form.method = 'POST';
        form.action = '/equipo/eliminar_multiples';
        ids.forEach(function(id) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'ids';
            input.value = id;
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
    }
}

function seleccionarTodos() {
    let checkboxes = document.querySelectorAll('.select-equipo');
    let seleccionar = document.getElementById('seleccionar-todos');
    if (seleccionar) {
        checkboxes.forEach(function(cb) {
            cb.checked = seleccionar.checked;
        });
        actualizarContadorExportar();
    }
}

function aplicarFiltros() {
    let filtroNro = document.getElementById('filtro_nro_int');
    let filtroSerie = document.getElementById('filtro_nro_serie');
    let filtroArea = document.getElementById('filtro_area');
    let filtroEstado = document.getElementById('filtro_estado');
    let filtroLocalidad = document.getElementById('filtro_localidad');
    let filtroTipo = document.getElementById('filtro_tipo');
    
    if (!filtroNro) return;
    
    let nroVal = filtroNro.value.toLowerCase();
    let serieVal = filtroSerie ? filtroSerie.value.toLowerCase() : '';
    let areaVal = filtroArea ? filtroArea.value : '';
    let estadoVal = filtroEstado ? filtroEstado.value : '';
    let localidadVal = filtroLocalidad ? filtroLocalidad.value : '';
    let tipoVal = filtroTipo ? filtroTipo.value : '';
    
    let table = document.getElementById('tablaEquipos');
    if (!table) return;
    let rows = table.getElementsByTagName('tr');
    let count = 0;
    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        if (cells.length < 5) continue;
        let nro = cells[1] ? cells[1].innerText.toLowerCase() : '';
        let serie = cells[2] ? cells[2].innerText.toLowerCase() : '';
        let area = cells[3] ? cells[3].innerText : '';
        let localidad = cells[4] ? cells[4].innerText : '';
        let tipo = cells[6] ? cells[6].innerText : '';
        let estado = cells[10] ? cells[10].innerText : '';
        let mostrar = true;
        if (nroVal && !nro.includes(nroVal)) mostrar = false;
        if (serieVal && !serie.includes(serieVal)) mostrar = false;
        if (areaVal && area !== areaVal) mostrar = false;
        if (estadoVal && estado !== estadoVal) mostrar = false;
        if (localidadVal && localidad !== localidadVal) mostrar = false;
        if (tipoVal && tipo !== tipoVal) mostrar = false;
        rows[i].style.display = mostrar ? '' : 'none';
        if (mostrar) count++;
    }
    let contador = document.getElementById('contador');
    if (contador) contador.innerText = 'Mostrando ' + count + ' de ' + (rows.length - 1) + ' equipos';
}

function limpiarFiltros() {
    let filtroNro = document.getElementById('filtro_nro_int');
    let filtroSerie = document.getElementById('filtro_nro_serie');
    let filtroArea = document.getElementById('filtro_area');
    let filtroEstado = document.getElementById('filtro_estado');
    let filtroLocalidad = document.getElementById('filtro_localidad');
    let filtroTipo = document.getElementById('filtro_tipo');
    
    if (filtroNro) filtroNro.value = '';
    if (filtroSerie) filtroSerie.value = '';
    if (filtroArea) filtroArea.value = '';
    if (filtroEstado) filtroEstado.value = '';
    if (filtroLocalidad) filtroLocalidad.value = '';
    if (filtroTipo) filtroTipo.value = '';
    aplicarFiltros();
}

function toggleMenuExportar() {
    let menu = document.getElementById('menuExportar');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

function exportarSeleccionados() {
    let checkboxes = document.querySelectorAll('.select-equipo:checked');
    let ids = Array.from(checkboxes).map(function(cb) { return cb.value; });
    if (ids.length === 0) {
        alert('No hay equipos seleccionados');
        return;
    }
    let form = document.createElement('form');
    form.method = 'POST';
    form.action = "/exportar/excel/seleccionados";
    ids.forEach(function(id) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'ids';
        input.value = id;
        form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function exportarFiltrados() {
    let rows = document.querySelectorAll('#tablaEquipos tbody tr');
    let ids = [];
    rows.forEach(function(row) {
        if (row.style.display !== 'none') {
            let checkbox = row.querySelector('.select-equipo');
            if (checkbox) ids.push(checkbox.value);
        }
    });
    if (ids.length === 0) {
        alert('No hay equipos visibles en el filtro actual');
        return;
    }
    let form = document.createElement('form');
    form.method = 'POST';
    form.action = "/exportar/excel/seleccionados";
    ids.forEach(function(id) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'ids';
        input.value = id;
        form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function actualizarContadorExportar() {
    let count = document.querySelectorAll('.select-equipo:checked').length;
    let btnMenu = document.getElementById('btnExportarSeleccionadosMenu');
    if (btnMenu) {
        btnMenu.innerHTML = '☑️ Equipos seleccionados (' + count + ')';
    }
}

function agregarObservacion(equipoId) {
    let equipoIdInput = document.getElementById('observacion_equipo_id');
    if (equipoIdInput) equipoIdInput.value = equipoId;
    let textoArea = document.getElementById('observacion_texto');
    if (textoArea) textoArea.value = '';
    let modal = document.getElementById('modalObservacion');
    if (modal) modal.style.display = 'block';
}

function cerrarModalObservacion() {
    let modal = document.getElementById('modalObservacion');
    if (modal) modal.style.display = 'none';
}

function guardarObservacion() {
    let equipoId = document.getElementById('observacion_equipo_id');
    let observacion = document.getElementById('observacion_texto');
    if (!equipoId || !observacion) {
        alert('Error al guardar la observacion');
        return;
    }
    let equipoIdVal = equipoId.value;
    let observacionVal = observacion.value.trim();
    if (!observacionVal) {
        alert('Debe ingresar una observacion');
        return;
    }
    fetch('/equipo/agregar_observacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipo_id: equipoIdVal, observacion: observacionVal })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.success) {
            location.reload();
        } else {
            alert('Error al guardar la observacion: ' + (data.error || 'desconocido'));
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Error de conexion');
    });
}

document.addEventListener('click', function(e) {
    let menu = document.getElementById('menuExportar');
    let btnGroup = document.querySelector('.btn-group');
    if (menu && btnGroup && !btnGroup.contains(e.target)) {
        menu.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    buscarEquipo();
    actualizarContadorExportar();
    
    let checkboxes = document.querySelectorAll('.select-equipo');
    checkboxes.forEach(function(cb) {
        cb.addEventListener('change', actualizarContadorExportar);
    });
    
    let selectEstado = document.getElementById('cambio_nuevo_estado_modal');
    if (selectEstado) {
        selectEstado.addEventListener('change', function() {
            let estado = this.value;
            let divResponsable = document.getElementById('div_responsable_cambio_modal');
            let divServicioTecnico = document.getElementById('div_servicio_tecnico_modal');
            let divFecha = document.getElementById('div_fecha_contrastacion_modal');
            let divFechaEnvio = document.getElementById('div_fecha_envio_modal');
            let divObservacion = document.getElementById('div_observacion_estado_modal');
            
            if (divObservacion) {
                divObservacion.style.display = estado ? 'block' : 'none';
            }
            if (divResponsable) {
                if (estado === 'Prestado' || estado === 'Volante' || estado === 'Fuera de Servicio' || estado === 'Mantencion') {
                    divResponsable.style.display = 'block';
                } else {
                    divResponsable.style.display = 'none';
                }
            }
            if (divServicioTecnico) {
                divServicioTecnico.style.display = (estado === 'Mantencion') ? 'block' : 'none';
            }
            if (divFecha && divFechaEnvio) {
                if (estado === 'Contrastacion') {
                    divFecha.style.display = 'block';
                    divFechaEnvio.style.display = 'block';
                } else {
                    divFecha.style.display = 'none';
                    divFechaEnvio.style.display = 'none';
                }
            }
        });
    }
    
    let formEstado = document.getElementById('formCambioEstadoModal');
    if (formEstado) {
        formEstado.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let nuevoEstado = document.getElementById('cambio_nuevo_estado_modal');
            let nuevoResponsable = document.getElementById('cambio_responsable_modal');
            let servicioTecnico = document.getElementById('cambio_servicio_tecnico_modal');
            let fechaContrastacion = document.getElementById('cambio_fecha_contrastacion_modal');
            let fechaEnvio = document.getElementById('cambio_fecha_envio_modal');
            let observacion = document.getElementById('cambio_observacion_estado_modal');
            
            if (!nuevoEstado || !nuevoEstado.value) {
                alert('Seleccione un estado');
                return;
            }
            
            if ((nuevoEstado.value === 'Prestado' || nuevoEstado.value === 'Volante' || nuevoEstado.value === 'Fuera de Servicio' || nuevoEstado.value === 'Mantencion') && (!nuevoResponsable || !nuevoResponsable.value)) {
                alert('Debe ingresar el responsable para el equipo ' + nuevoEstado.value);
                return;
            }
            
            if (nuevoEstado.value === 'Mantencion' && (!servicioTecnico || !servicioTecnico.value)) {
                alert('Debe ingresar el servicio tecnico para la mantencion');
                return;
            }
            
            if (nuevoEstado.value === 'Contrastacion' && (!fechaEnvio || !fechaEnvio.value)) {
                alert('Debe ingresar la fecha de envio al laboratorio');
                return;
            }
            
            let formData = new FormData();
            formData.append('estado', nuevoEstado.value);
            if (nuevoResponsable && nuevoResponsable.value) formData.append('nuevo_responsable', nuevoResponsable.value);
            if (servicioTecnico && servicioTecnico.value) formData.append('servicio_tecnico', servicioTecnico.value);
            if (fechaContrastacion && fechaContrastacion.value) formData.append('fecha_contrastacion', fechaContrastacion.value);
            if (fechaEnvio && fechaEnvio.value) formData.append('fecha_envio_laboratorio', fechaEnvio.value);
            if (observacion && observacion.value) formData.append('observacion', observacion.value);
            
            try {
                let response = await fetch('/equipo/cambiar_estado/' + window.equipoIdActual, {
                    method: 'POST',
                    body: formData
                });
                let data = await response.json();
                if (data.success) {
                    location.reload();
                } else {
                    alert('Error al cambiar estado');
                }
            } catch (error) {
                alert('Error de conexion');
            }
        });
    }
    
    window.onclick = function(event) {
        let modalEstado = document.getElementById('modalCambioEstado');
        if (modalEstado && event.target === modalEstado) {
            cerrarModalEstado();
        }
        let modalObs = document.getElementById('modalObservacion');
        if (modalObs && event.target === modalObs) {
            cerrarModalObservacion();
        }
    };
});