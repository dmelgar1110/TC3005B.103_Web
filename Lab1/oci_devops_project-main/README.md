# OCI DevOps Project

Este repositorio contiene la implementación de un proyecto de CI/CD utilizando Oracle Cloud Infrastructure (OCI) DevOps Services, incluyendo pipelines de construcción, despliegue y configuraciones de infraestructura como código.

## 📋 Descripción

El proyecto implementa un flujo completo de integración y despliegue continuo (CI/CD) en OCI, agrupando recursos DevOps necesarios para compilar, probar y desplegar aplicaciones en la nube de Oracle.

## 🏗️ Estructura del Proyecto

```
oci_devops_project/
├── MtdrSpring/              # Aplicación Spring Boot
├── java_checks.xml          # Configuración de análisis de código Java
├── LICENSE                  # Licencia CC-BY-SA-4.0
├── LICENSE.txt              # Licencia UPL-1.0
└── README.md                # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Shell** (33.9%) - Scripts de automatización y configuración
- **Java** (33.5%) - Aplicación principal Spring Boot
- **HCL** (17.4%) - Terraform para infraestructura como código
- **JavaScript** (9.7%) - Frontend y scripts de soporte
- **CSS** (2.6%) - Estilos de la aplicación
- **HTML** (1.6%) - Plantillas y vistas

## 🚀 Recursos OCI DevOps

Este proyecto incluye los siguientes componentes de OCI DevOps:

### 📦 Proyecto DevOps
Agrupación lógica de recursos necesarios para implementar el flujo de trabajo CI/CD.

### 🔄 Pipelines de Construcción
- Compilación automática de la aplicación
- Ejecución de pruebas unitarias
- Análisis de calidad de código con SonarQube (configurado en `java_checks.xml`)
- Generación de artefactos

### 🚢 Pipelines de Despliegue
- Despliegue automatizado a ambientes de OCI
- Integración con Oracle Container Registry
- Soporte para Oracle Kubernetes Engine (OKE)

### 📝 Repositorios de Código
- Repositorio Git privado en OCI
- Control de versiones integrado

### 🎯 Artefactos
- Imágenes de contenedor
- Artefactos genéricos
- Charts de Helm

### ⚡ Triggers
- Ejecución automática de builds al hacer commits
- Webhooks para integración continua

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener:

- Una cuenta de Oracle Cloud Infrastructure (OCI)
- OCI CLI configurado y autenticado
- Permisos necesarios para crear recursos de DevOps
- Java Development Kit (JDK) 11 o superior
- Maven o Gradle para construcción local
- Docker (opcional, para pruebas locales de contenedores)

## 🔧 Configuración Inicial

### 1. Configurar OCI CLI

```bash
# Instalar OCI CLI
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"

# Configurar credenciales
oci setup config
```

### 2. Crear Grupos Dinámicos

Crear los siguientes grupos dinámicos en OCI IAM:

```
BuildPipelineDynamicGroup
DeployPipelineDynamicGroup
```

### 3. Configurar Políticas IAM

Aplicar las siguientes políticas en tu compartimento:

```
Allow dynamic-group BuildPipelineDynamicGroup to manage repos in compartment <your-compartment>
Allow dynamic-group BuildPipelineDynamicGroup to read secret-family in tenancy
Allow dynamic-group BuildPipelineDynamicGroup to manage devops-family in compartment <your-compartment>
Allow dynamic-group BuildPipelineDynamicGroup to manage all-artifacts in tenancy
Allow dynamic-group DeployPipelineDynamicGroup to manage all-resources in compartment <your-compartment>
```

### 4. Crear Tópico de Notificaciones

```bash
oci ons topic create --name devops-notifications --compartment-id <your-compartment-ocid>
```

## 🏃 Inicio Rápido

### Clonar el Repositorio

```bash
git clone https://github.com/jorgecarvel/oci_devops_project.git
cd oci_devops_project
```

### Construcción Local

```bash
cd MtdrSpring
./mvnw clean package
```

### Despliegue Manual

1. Accede a la consola de OCI
2. Navega a Developer Services > DevOps > Projects
3. Selecciona tu proyecto
4. Ve a Build Pipelines y ejecuta manualmente

## 📊 Pipeline de CI/CD

### Flujo de Construcción (Build Pipeline)

1. **Checkout** - Obtención del código fuente
2. **Build** - Compilación de la aplicación Spring Boot
3. **Test** - Ejecución de pruebas unitarias
4. **Quality Check** - Análisis con SonarQube
5. **Package** - Creación de imagen Docker
6. **Publish** - Subida a Oracle Container Registry
7. **Trigger Deploy** - Activación del pipeline de despliegue

### Flujo de Despliegue (Deployment Pipeline)

1. **Pull Image** - Descarga de imagen desde Registry
2. **Deploy to OKE** - Despliegue a Kubernetes
3. **Health Check** - Verificación de salud de la aplicación
4. **Rollback** (si es necesario) - Reversión a versión anterior

## 🔍 Análisis de Código

El proyecto utiliza reglas de calidad definidas en `java_checks.xml` que incluyen:

- Verificación de convenciones de código
- Detección de código duplicado
- Análisis de complejidad ciclomática
- Identificación de vulnerabilidades de seguridad

## 🌐 Ambientes

- **Development** - Ambiente de desarrollo
- **Staging** - Ambiente de pruebas
- **Production** - Ambiente de producción

## 🔐 Secretos y Configuración

Los secretos se gestionan a través de:

- **OCI Vault** - Para credenciales sensibles
- **ConfigMaps** - Para configuración de aplicación
- **Kubernetes Secrets** - Para credenciales en cluster

## 📈 Monitoreo y Logs

- **OCI Logging** - Logs de DevOps pipelines
- **Application Performance Monitoring** - Métricas de aplicación
- **Log Analytics** - Análisis agregado de logs

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo:

- **CC-BY-SA-4.0** - Creative Commons Attribution Share Alike 4.0
- **UPL-1.0** - Universal Permissive License v1.0

Ver archivos `LICENSE` y `LICENSE.txt` para más detalles.

## 📧 Contacto

Jorge Carvel - [@jorgecarvel](https://github.com/jorgecarvel)

Project Link: [https://github.com/jorgecarvel/oci_devops_project](https://github.com/jorgecarvel/oci_devops_project)

## 🔗 Enlaces Útiles

- [OCI DevOps Documentation](https://docs.oracle.com/en-us/iaas/Content/devops/using/home.htm)
- [OCI CLI Reference](https://docs.oracle.com/en-us/iaas/tools/oci-cli/latest/oci_cli_docs/)
- [Oracle Container Registry](https://docs.oracle.com/en-us/iaas/Content/Registry/home.htm)
- [Oracle Kubernetes Engine](https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm)

## 🙏 Agradecimientos

- Oracle Cloud Infrastructure por la plataforma DevOps
- La comunidad de código abierto por las herramientas utilizadas
- Todos los contribuidores que han participado en este proyecto

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub