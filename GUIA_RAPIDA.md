# ⚡ Guía Rápida - Horario Inteligente v2

## 🎯 Qué Cambió Principales

**v1 → v2:**
- ❌ Temporizador manual → ✅ Horario automático por hora real
- ❌ Lista de actividades → ✅ Tabla tipo horario escolar
- ❌ Botones iniciar/pausar/siguiente → ✅ Detección automática de actividad actual
- ✅ **NUEVO:** Ajuste automático por retrasos
- ✅ **NUEVO:** Estadísticas de puntualidad
- ✅ **NUEVO:** Barra de progreso
- ✅ **NUEVO:** Sistema semanal (7 días)

---

## 🚀 Primeros Pasos (5 minutos)

### 1. Abre esta Página

📍 **Ubicación:** `index.html` en tu carpeta

**Formas de abrir:**

- **Doble clic:** Abre `index.html` directamente (navegador automático)
- **Con servidor Python:**
  ```bash
  python -m http.server 8000
  ```
  Luego abre: `http://localhost:8000`

- **Con Node.js:**
  ```bash
  npx http-server
  ```

- **Con PHP:**
  ```bash
  php -S localhost:8000
  ```

Ver archivo: [SERVIDOR-LOCAL.html](SERVIDOR-LOCAL.html) para +5 opciones

### 2. Crear Perfil

1. Haz clic: `+ Nuevo` o `+ Crear Perfil`
2. Escribe nombre: "Mi Semana"
3. Click: `Crear`

### 3. Agregar Actividade

Formulario: Nueva Actividad
- **Nombre:** "Estudiar Inglés"
- **Hora Inicio:** 16:00 (4 PM)
- **Hora Fin:** 17:30 (5:30 PM)
- **Día:** Lunes

➜ Click: `Agregar`

### 4. Ver Horario

La tabla automáticamente mostrará:

```
| 16:00 | 17:30 | Estudiar Inglés | [✏️ 🗑️]
```

### 5. Activar al Momento

Cuando sea la hora (16:00 en este ejemplo):
- El sistema **automáticamente** resalta esa fila
- Aparece un botón: `▶️ INICIAR ACTIVIDAD`
- Presiona el botón
- El sistema detecta si eres puntual o llegas tarde

---

## 📊 Entender Detección Automática

### Sin hacer nada:

```
Hora actual: 16:05
```

El sistema automáticamente:
1. ✅ Detecta que es la hora de "Estudiar Inglés"
2. ✅ Resalta esa fila en verde
3. ✅ Muestra barra de progreso (00:05 / 01:30)
4. ✅ Habilita el botón `INICIAR ACTIVIDAD`

### Cuando presionas "INICIAR":

```
Actividad programada: 16:00
Presionaste en: 16:05
Sistema detecta: 5 minutos de retraso
```

Automáticamente:
1. ✅ Registra que llegaste 5 minutos tarde
2. ✅ Ajusta TODAS las actividades +5 minutos después
3. ✅ Muestra alerta: "⏰ Horario ajustado: +5 minutos de retraso"

---

## 📅 Sistema Semanal

### Vista por Día

En la parte superior: 7 pestañas
```
[Lun] [Mar] [Mié] [Jue] [Vie] [Sáb] [Dom]
```

- El día actual está resaltado (ej: LUN si hoy es lunes)
- Click en cualquier día para ver ese horario
- Las actividades se guardan independientemente por día

---

## 📈 Estadísticas de Puntualidad

En la sección `📊 Mi Productividad`:

```
A tiempo:       5    (Iniciaste estas actividades a la hora)
Con retraso:    2    (Llegaste tarde)
Promedio retraso: 8 min (Promedio de minutos de retraso)
```

---

## ⏱️ Barra de Progreso

Cuando una actividad está en curso:

```
Actividad actual
00:05 / 01:30  [████████░░░░░░░░░░]  33% completado
```

Se actualiza cada segundo automáticamente.

---

## ⚙️ Configuración de Pausas

En `⚙️ Configuración`:

1. Activa: "Tiempo libre entre actividades"
2. Selecciona duración: **5 / 10 / 15 / 20 minutos**

### Resultado:

Si tienes:
```
14:00 - 14:50 Matemática
15:00 - 15:50 Inglés
```

Con 10 min de pausa, automáticamente se vuelve:
```
14:00 - 14:50 Matemática
14:50 - 15:00 ☕ Tiempo libre
15:00 - 15:50 Inglés
```

---

## 🔄 Editar o Eliminar Actividades

En la tabla, cada actividad tiene:
- **✏️** = Editar (aparecen campos arriba)
- **🗑️** = Eliminar (confirma y se elimina)

---

## 🗑️ Limpiar/Reiniciar

En la parte inferior:

- **🔄 Reiniciar día** = Reinicia todas actividades del día actual
- **🗑️ Limpiar todo** = Borra todo el horario (cuidado!)

---

## 💾 Los Datos se Guardan Automáticamente

- En **LocalStorage** del navegador 
- No necesitas presionar "guardar"
- Se guardan al cambiar algo (agregar, editar, eliminar)

---

## 📱 Instalar como App

### Android (Chrome):

1. Abre la app en Chrome
2. Menú ≡ (tres puntos) → "Instalar app"
3. Confirma
4. Aparecerá en tu pantalla de inicio
5. ¡Funciona offline! 🎉

### iOS (Safari):

1. Abre la app en Safari
2. Compartir → "Agregar a pantalla de inicio"
3. Dale un nombre (ej: "Horario")
4. Agregar
5. ¡Funciona offline! 🎉

---

## 🆘 Troubleshooting

**P: ¿Por qué no se actualiza la actividad actual?**
R: Recarga la página (Ctrl+R). La detección ocurre cada segundo automáticamente.

**P: ¿Se pierden los datos si cierro navegador?**
R: No se pierden. Se guardan en LocalStorage. Reaparecen al abrir de nuevo.

**P: ¿Cómo cambio de perfil?**
R: Arriba en "Perfil:", selectiona otro de la lista desplegable.

**P: ¿Qué pasa con v1?**
R: v1 y v2 usan almacenamientos diferentes. v1 no se toca. Puedes tener ambas abiertas sin conflictos.

---

## 💡 Tips de Uso

💡 **Crea múltiples perfiles:**
- "Lunes a Viernes" - Horario de semana
- "Fin de Semana" - Horario descanso
- "Proyecto X" - Para un proyecto específico

💡 **Usa las pausas:**
- 5 min: Cambios rápidos
- 10 min: Descansos normales
- 15-20 min: Cambios grandes de contexto

💡 **Revisa tu puntualidad:**
- Si promedios 10+ min de retraso, tus tiempos son muy ajustados
- Intenta llevar 5-10 min de ventaja

💡 **Edita el horario si lo necesitas:**
- ✏️ para cambiar horas
- 🗑️ para eliminar actividades que cancelaste

---

## 📚 Más Información

- 📖 Lee [README.md](README.md) para documentación completa
- 📝 Ve [CAMBIOS.md](CAMBIOS.md) para la comparación v1 vs v2
- 💬 Contacta con soporte si tienes dudas

---

**¡Ahora puedes empezar a usar Horario Inteligente v2!** 🚀⏰
