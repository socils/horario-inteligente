# 🚀 Horario Inteligente v2

Una **Progressive Web App (PWA) inteligente** que organiza tu horario semana basándose en **hora real del sistema**, con detección automática de actividades actuales y ajuste dinámico por retrasos.

## ✨ Características Principales

✅ **Basada en Hora Real** - Las actividades se muestran con horas específicas (inicio/fin)
✅ **Detección Automática** - El sistema detecta automáticamente qué actividad está en curso
✅ **Sistema Semanal** - Organiza tu semana (lunes a domingo) con horarios independientes
✅ **Inteligencia Adaptativa** - Ajusta automáticamente el horario si empiezas con retraso
✅ **Tabla tipo Horario Escolar** - Interfaz limpia y moderna con formato tabla
✅ **Barra de Progreso** - Visualiza el progreso de la actividad actual
✅ **Estadísticas de Puntualidad** - Registra si llegaste a tiempo o tarde y promedios
✅ **Alertas Automáticas** - Muestra mensajes inteligentes de estado
✅ **Tiempo Libre Automático** - Inserta pausas automáticamente entre actividades
✅ **Progressive Web App** - Instalable en celular y funciona offline
✅ **Multi-usuario Local** - Perfiles independientes en el mismo navegador
✅ **Diseño Glassmorphism** - Interfaz moderna, responsiva y hermosa

## 📊 ¿Qué es la "Inteligencia"?

El sistema es inteligente porque:

1. **Detecta automáticamente** la hora actual del sistema
2. **Identifica qué actividad** corresponde en este momento
3. **Resalta la actividad actual** sin que presiones botones
4. **Se adapta a retrasos** ajustando automáticamente el resto del horario
5. **Registra puntualidad** (¿empezaste a tiempo o tarde?)
6. **Calcula promedio de retrasos** para estadísticas
7. **Cambia instantáneamente** cuando pasa el tiempo (se actualiza cada segundo)

## 📦 Archivos del Proyecto

```
horario-inteligente/
├── index.html           # Estructura HTML (pestañas, tabla, formularios)
├── style.css            # Estilos glassmorphism + tabla + responsive
├── app.js               # Lógica principal (hora real, detección, ajustes)
├── service-worker.js    # Funcionamiento offline + PWA
├── manifest.json        # Configuración de instalación
└── README.md            # Este archivo
```

## 🚀 Cómo Usar

### 1️⃣ Ejecutar Localmente

**Python 3 (Recomendado):**
```bash
python -m http.server 8000
```
Luego abre: `http://localhost:8000`

**Node.js:**
```bash
npm install -g http-server
http-server
```

**PHP:**
```bash
php -S localhost:8000
```

### 2️⃣ Crear un Perfil
- Haz clic en `+ Nuevo` o `+ Crear Perfil`
- Ingresa el nombre del perfil
- Confirma

### 3️⃣ Crear Actividades
- En la sección `Nueva Actividad`:
  - **Nombre**: "Estudiar Matemática"
  - **Hora Inicio**: 16:00
  - **Hora Fin**: 17:30
  - **Día**: Lunes
- Haz clic en **Agregar**

### 4️⃣ Seleccionar Día
- Las pestañas en la parte superior muestran los 7 días
- Haz clic en el día para ver su horario
- El día actual está resaltado

### 5️⃣ Visualizar Tabla
- La tabla muestra:
  - **Hora Inicio | Hora Fin | Actividad | Acciones**
  - La actividad actual se resalta automáticamente
  - Los espacios de tiempo libre aparecen en gris

### 6️⃣ Iniciar una Actividad
- Cuando la actividad está en curso, aparece un botón `▶️ INICIAR ACTIVIDAD`
- El sistema:
  - Verifica si empezaste a tiempo
  - Si hay retraso, ajusta automáticamente todas las actividades siguientes
  - Registra la puntualidad en las estadísticas

### 7️⃣ Ver Barra de Progreso
- Mientras una actividad está en curso:
  - La barra muestra el progreso (00:00 / 01:00)
  - Se actualiza cada segundo
  - Desaparece cuando termina la actividad

### 8️⃣ Configurar Tiempo Libre
- En `⚙️ Configuración`:
  - Activa/desactiva pausas automáticas
  - Selecciona duración: 5, 10, 15, 20 minutos
  - Las pausas se insertan automáticamente entre actividades

### 9️⃣ Ver Estadísticas
- `📊 Mi Productividad`:
  - **A tiempo**: Cuántas actividades iniciaste puntualmente
  - **Con retraso**: Cuántas iniciaste tarde
  - **Promedio retraso**: Promedio de minutos de demora

### 🔟 Editar o Eliminar
- Hover sobre una actividad en la tabla
- Usa los botones `✏️` (editar) o `🗑️` (eliminar)

## 🎯 Ejemplo de Uso Real

```
Lunes 18 de Febrero

| 08:00 | 09:00 | Matemática       | [✏️ 🗑️]
| 09:00 | 09:10 | ☕ Tiempo libre   |
| 09:10 | 10:00 | Inglés           | [✏️ 🗑️]
| 10:00 | 10:10 | ☕ Tiempo libre   |
| 10:10 | 11:00 | Física           | [✏️ 🗑️]
```

**Si llegas 5 minutos tarde a Matemática:**
- El sistema detecta el retraso
- Ajusta el horario automáticamente:
```
| 08:05 | 09:05 | Matemática       |
| 09:05 | 09:15 | ☕ Tiempo libre   |
| 09:15 | 10:05 | Inglés           |
| 10:05 | 10:15 | ☕ Tiempo libre   |
| 10:15 | 11:05 | Física           |
```

## 💾 Almacenamiento de Datos

Los datos se guardan en **LocalStorage** del navegador bajo la clave `horario_profiles_v2`:

```json
{
  "name": "Mi Perfil",
  "schedule": {
    "0": [  // Domingo
      { "id": 1234, "name": "Desayuno", "start": "08:00", "end": "08:30" }
    ],
    "1": [  // Lunes
      { "id": 5678, "name": "Estudiar", "start": "16:00", "end": "17:30" }
    ]
  },
  "stats": {
    "onTime": 5,
    "late": 2,
    "totalDelays": 15,
    "count": 7
  }
}
```

## 📱 Instalación como App

### Android (Chrome):
1. Abre la app en Chrome
2. Menú ≡ → **"Instalar app"**
3. Confirma

### iOS (Safari):
1. Abre la app en Safari
2. Compartir → **"Agregar a pantalla de inicio"**
3. Personaliza el nombre

### Funcionará Offline Después de la Instalación ✅

## 🌐 Desplegar a Internet

### GitHub Pages:
```bash
git push origen main
```
La app estará en: `https://tu-usuario.github.io/tu-repo`

### Netlify:
1. Conecta tu repositorio de GitHub
2. Deploy automático

### Vercel:
1. Importa el repositorio
2. Deploy automático

## 🔧 Características Técnicas

| Característica | Detalles |
|---|---|
| **API de Reloj** | Actualización cada segundo |
| **Formato Horario** | HH:MM (24 horas) |
| **Conversión** | Minutos ↔️ Tiempo |
| **Detección Actual** | Según hora del sistema |
| **Ajustes Dinámicos** | Por día y fecha |
| **Estadísticas** | Puntualidad y retrasos |
| **Offlineprimer** | Service Worker con estrategia cache-first |

## 🎨 Diseño

- **Glassmorphism** con blur y transparencia
- **Gradientes** modernos (azul → púrpura)
- **Tabla** limpia y responsiva
- **Animaciones** suaves
- **Dark Mode** por defecto
- **Escala 100% Responsivo** (móvil, tablet, desktop)

## 🔐 Privacidad

✅ **Sin servidor** - Todo funciona en tu dispositivo
✅ **Datos locales** - Nada se envía a internet
✅ **Privado** - Solo tú accedes a tus datos
✅ **Offline** - Funciona sin conexión

## 📊 Diferencias con v1

| Característica | v1 | v2 |
|---|---|---|
| Sistema | Duración (temporizador) | Hora real (horario) |
| Detección | Manual (botón iniciar) | Automática (hora del sistema) |
| Visualización | Lista vertical | Tabla tipo horario |
| Actividades | Una lista | Por día de la semana |
| Retrasos | No soporta | Ajuste automático |
| Estadísticas | Tiempo usado | Puntualidad y promedio retrasos |
| Barra Progreso | No | Sí |
| Alertas | No | Sí (info, warning, etc) |

## 🚀 Próximas Mejoras

- 🔔 Notificaciones push para recordatorios
- 📤 Exportar horario como PDF o imagen
- ☁️ Sincronización en la nube
- 🎵 Sonidos de notificación
- 📊 Gráficas de productividad avanzadas
- 🌍 Múltiples idiomas

## 🤝 Soporte y Troubleshooting

**La app no funciona:**
1. Verifica que JavaScript esté habilitado
2. Limpia cache del navegador
3. Intenta en otra pestaña incógnito
4. Abre consola (F12) para ver errores

**Los datos se perdieron:**
- Los datos están en LocalStorage
- Limpieza del cache/historial del navegador los borra
- Realiza backups exportando manualmente

**No se actualiza en tiempo real:**
- Verifica que el intervalo de actualización sea < 1 segundo
- Recarga la página (Ctrl+R o Cmd+R)

## 💡 Tips

💡 Crea múltiples perfiles para diferentes contextos:
- Perfil "Escuela"
- Perfil "Trabajo"
- Perfil "Deporte"
- Perfil "Personal"

💡 Usa tiempo libre inteligente:
- 5 min para cambios rápidos
- 15 min para descansos normales
- 20 min para cambios de contexto grande

💡 Analiza tus retrasos:
- Verifica el promedio
- Si es alto, ajusta tus tiempos planeados
- Llega 5-10 min antes

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir

---

**¡Disfruta organizando tu horario inteligentemente!** ⏰✨

## 📦 Archivos Incluidos

- `index.html` - Estructura HTML de la aplicación
- `style.css` - Estilos con glassmorphism y responsive design
- `app.js` - Lógica completa de la aplicación
- `service-worker.js` - Soporte offline y cacheo
- `manifest.json` - Configuración de PWA
- `README.md` - Este archivo

## 🚀 Instalación y Uso

### Desde tu computadora:

1. **Descarga todos los archivos** en una carpeta
2. **Abre `index.html`** en tu navegador (usando un servidor local)
3. **Instala la app** (opcional) - El navegador te mostrará la opción

### En tu teléfono:

#### Android (Chrome):
1. Abre la aplicación en Chrome
2. Toca el menú (tres puntos) → **"Instalar app"**
3. Confirma la instalación

#### iOS Safari:
1. Abre la aplicación en Safari
2. Toca el botón Compartir → **"Agregar a pantalla de inicio"**
3. Personaliza el nombre si deseas

### Con GitHub Pages:

1. Sube los archivos a un repositorio de GitHub
2. Habilita GitHub Pages en `Settings`
3. Accede a `https://tuusuario.github.io/tu-repositorio`

## 💡 Cómo Usar

### 1. **Crear Perfil**
- Haz clic en **"+ Nuevo"** en el selector de perfil
- Ingresa el nombre del perfil
- Crea múltiples perfiles para diferentes usuarios

### 2. **Agregar Actividades**
- En la sección **"Nueva Actividad"**
- Ingresa el nombre (ej: "Estudiar Matemática")
- Define la duración en minutos
- Haz clic en **"Agregar"**

### 3. **Controlar Actividades**
- Haz clic en **▶️ INICIAR** para comenzar la actividad
- El temporizador mostrará el tiempo transcurrido
- Haz clic en **⏭️ SIGUIENTE** cuando termines
- El tiempo se registra automáticamente

### 4. **Pausar Actividades**
- Mientras una actividad está en progreso, verás el botón **⏸️ PAUSA**
- Haz clic para pausar, el temporizador se detiene
- Vuelve a hacer clic en **▶️ INICIAR** para reanudar

### 5. **Configurar Pausas**
- Ve a la sección **"⚙️ Tiempo Libre"**
- Activa el switch para habilitar pausas automáticas
- Selecciona la duración: 5, 10, 15 o 20 minutos
- Las pausas se insertan automáticamente entre actividades

### 6. **Ver Historial**
- La sección **"📊 Historial"** muestra:
  - Actividades completadas hoy
  - Tiempo total invertido
  - Detalle de cada actividad

### 7. **Editar o Eliminar Actividades**
- Hover sobre una actividad
- Usa los botones **✏️** para editar o **🗑️** para eliminar
- Los cambios se guardan automáticamente

## 🛠️ Requisitos Técnicos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- HTTPS activo (para Service Worker en producción)
- LocalStorage habilitado
- JavaScript habilitado

## 📱 Compatibilidad

| Navegador | Escritorio | Móvil |
|-----------|-----------|-------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Opera | ✅ | ✅ |

## 🎨 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Glassmorphism, gradientes, animaciones
- **JavaScript Vanilla** - Sin frameworks
- **Service Worker** - Soporte offline
- **Web App Manifest** - PWA instalable
- **LocalStorage API** - Persistencia de datos

## 💾 Almacenamiento de Datos

Todos los datos se guardan en **LocalStorage** del navegador:
- `horario_profiles` - Lista de perfiles y horarios
- Cada perfil contiene:
  - Nombre
  - Actividades (schedule)
  - Historial del día
  - Configuración de pausas

Los datos persisten incluso cerrando el navegador.

## 🔐 Privacidad

- ✅ **Sin servidor** - Todo funciona en tu dispositivo
- ✅ **Datos locales** - Nada se envía a internet
- ✅ **Privado** - Solo tú tienes acceso a tus datos
- ✅ **Funciona offline** - No requiere conexión

## 🚀 Deploying a Producción

### Opción 1: GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/usuario/horario-inteligente.git
git push -u origin main
```

### Opción 2: Netlify
1. Conecta tu repositorio de GitHub
2. Rama: `main`
3. Deploy automático al hacer push

### Opción 3: Vercel
1. Importa el repositorio
2. Deploy automático
3. Dominio personalizado (opcional)

## 📝 Notas Importantes

- El Service Worker se cachea en la primera carga
- Los cambios en `service-worker.js` requieren actualización manual del cache
- Los datos están limitados por el almacenamiento del navegador (generalmente 5-10MB)
- La app funciona perfectamente offline después de la primera carga

## 🎯 Funcionalidades Futuras

- 📲 Notificaciones push para recordatorios
- 📊 Gráficos de productividad
- 🌙 Modo oscuro (ya implementado)
- 📤 Exportar datos como PDF
- ☁️ Sincronización en la nube
- 🎵 Sonidos de notificación

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Reportar bugs
- Sugerir mejoras
- Hacer fork y mejorar el código

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir.

## 👨‍💻 Soporte

Si encuentras algún problema:

1. Verifica que JavaScript esté habilitado
2. Limpia el cache del navegador
3. Intenta en otro navegador
4. Abre la consola (F12) para ver errores

## 🌟 Tips & Trucos

💡 **Atajo de teclado:**
- Enter en campos de entrada = Agregar actividad

💡 **Múltiples perfiles:**
- Perfil para trabajo
- Perfil para estudio
- Perfil para ejercicio

💡 **Optimizar pausas:**
- 5 min para actividades cortas
- 15 min para actividades largas
- 20 min para cambios de contexto

💡 **Instalación más rápida:**
- Fija en la pantalla de inicio
- Acceso directo desde launcher
- Íconos personalizados (iOS)

---

**¡Disfruta organizando tu horario de manera inteligente!** ⏰✨
