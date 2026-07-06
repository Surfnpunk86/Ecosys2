// Catálogo de las 60 herramientas de coaching de ECOSYS
// Generado con 12 herramientas por cada etapa: SER, HACER, TENER, DAR, RECIBIR
const TOOLS = [
  {
    "id": "ser-rueda-de-la-identidad",
    "name": "Rueda de la Identidad",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Explora cómo se percibe el cliente en las áreas clave de su identidad hoy.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-detector-de-creencias-limitantes",
    "name": "Detector de Creencias Limitantes",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Identifica las creencias que están frenando el avance del cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-mapa-de-valores-personales",
    "name": "Mapa de Valores Personales",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Clarifica los valores que guían las decisiones del cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-dialogo-con-tu-yo-futuro",
    "name": "Diálogo con tu Yo Futuro",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Conecta al cliente con la versión de sí mismo que quiere llegar a ser.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-auditoria-de-autoestima",
    "name": "Auditoría de Autoestima",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Revisa cómo se habla el cliente a sí mismo y dónde se sabotea.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-brujula-de-proposito",
    "name": "Brújula de Propósito",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Ayuda al cliente a nombrar su propósito con mayor claridad.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-inventario-de-fortalezas",
    "name": "Inventario de Fortalezas",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Enumera y prioriza las fortalezas naturales del cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-ritual-de-soltar-mascaras",
    "name": "Ritual de Soltar Máscaras",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Facilita reconocer los roles que el cliente actúa por miedo o costumbre.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-termometro-emocional",
    "name": "Termómetro Emocional",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Registra el estado emocional actual del cliente y sus disparadores.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-historia-de-vida-reescrita",
    "name": "Historia de Vida Reescrita",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Ayuda al cliente a resignificar un episodio clave de su historia.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-detector-de-sabotaje-interno",
    "name": "Detector de Sabotaje Interno",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Detecta patrones repetitivos que el cliente usa para auto-limitarse.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "ser-vision-de-identidad-a-5-anos",
    "name": "Visión de Identidad a 5 Años",
    "cat": "SER",
    "icon": "🧭",
    "desc": "Construye una imagen concreta de quién quiere ser el cliente en 5 años.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-matriz-de-prioridades",
    "name": "Matriz de Prioridades",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Ordena las tareas del cliente según impacto y urgencia real.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-diseno-de-habitos-clave",
    "name": "Diseño de Hábitos Clave",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Define los hábitos mínimos que moverán la aguja para el cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-plan-de-90-dias",
    "name": "Plan de 90 Días",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Traza un plan de acción trimestral con hitos claros.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-rueda-de-productividad",
    "name": "Rueda de Productividad",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Evalúa qué tan bien está usando el cliente su tiempo y energía.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-auditoria-de-tiempo-semanal",
    "name": "Auditoría de Tiempo Semanal",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Revisa en qué se está yendo realmente el tiempo del cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-sistema-de-rutinas-diarias",
    "name": "Sistema de Rutinas Diarias",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Diseña una rutina diaria sostenible alineada a sus metas.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-mapa-de-procesos-del-cliente",
    "name": "Mapa de Procesos del Cliente",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Documenta el proceso que sigue el cliente para lograr resultados.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-checklist-pre-sesion",
    "name": "Checklist Pre-Sesión",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Prepara al cliente para aprovechar al máximo la próxima sesión.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-plan-de-accion-smart",
    "name": "Plan de Acción SMART",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Convierte una meta difusa en objetivos específicos y medibles.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-rastreador-de-consistencia",
    "name": "Rastreador de Consistencia",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Da seguimiento a qué tan consistente ha sido el cliente esta semana.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-protocolo-anti-procrastinacion",
    "name": "Protocolo Anti-Procrastinación",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Identifica el patrón de procrastinación y diseña un contraataque.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "hacer-revision-semanal-de-metodo",
    "name": "Revisión Semanal de Método",
    "cat": "HACER",
    "icon": "⚙️",
    "desc": "Cierra la semana revisando qué funcionó y qué ajustar.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-calculadora-de-precios-de-sesion",
    "name": "Calculadora de Precios de Sesión",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Ayuda al cliente a definir un precio justo y sostenible.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-proyeccion-de-ingresos-mensual",
    "name": "Proyección de Ingresos Mensual",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Proyecta ingresos según clientes activos y precio promedio.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-mapa-de-clientes-ideales",
    "name": "Mapa de Clientes Ideales",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Define con precisión a quién sirve mejor el cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-embudo-de-captacion",
    "name": "Embudo de Captación",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Diseña el camino que sigue un lead hasta convertirse en cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-auditoria-de-oferta",
    "name": "Auditoría de Oferta",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Revisa si la oferta actual del cliente comunica valor real.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-plan-de-escalamiento-de-precios",
    "name": "Plan de Escalamiento de Precios",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Traza cómo subir precios sin perder clientes clave.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-analisis-de-rentabilidad-por-programa",
    "name": "Análisis de Rentabilidad por Programa",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Compara qué programas realmente generan ganancia.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-estrategia-de-retencion-de-clientes",
    "name": "Estrategia de Retención de Clientes",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Diseña acciones para que los clientes se queden más tiempo.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-plan-de-lanzamiento-de-programa",
    "name": "Plan de Lanzamiento de Programa",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Organiza el lanzamiento de un nuevo programa paso a paso.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-diagnostico-de-posicionamiento",
    "name": "Diagnóstico de Posicionamiento",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Evalúa cómo se percibe el cliente frente a su competencia.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-matriz-de-fuentes-de-ingreso",
    "name": "Matriz de Fuentes de Ingreso",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Mapea todas las formas en que el cliente genera ingresos hoy.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "tener-plan-financiero-anual",
    "name": "Plan Financiero Anual",
    "cat": "TENER",
    "icon": "💼",
    "desc": "Define metas financieras concretas para el año.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-mapa-de-impacto-social",
    "name": "Mapa de Impacto Social",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Visualiza a quién y cómo está impactando el trabajo del cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-diseno-de-legado-profesional",
    "name": "Diseño de Legado Profesional",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Ayuda al cliente a definir qué legado quiere dejar.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-auditoria-de-contribucion",
    "name": "Auditoría de Contribución",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Revisa si el cliente está dando desde la abundancia o el agotamiento.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-plan-de-mentoria-a-otros-coaches",
    "name": "Plan de Mentoría a Otros Coaches",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Diseña cómo el cliente puede formar a otros en su método.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-estrategia-de-contenido-con-proposito",
    "name": "Estrategia de Contenido con Propósito",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Alinea el contenido que comparte el cliente con su misión.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-medicion-de-transformacion-en-clientes",
    "name": "Medición de Transformación en Clientes",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Documenta los cambios reales logrados en sus clientes.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-diseno-de-programa-pro-bono",
    "name": "Diseño de Programa Pro Bono",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Estructura una forma sostenible de dar valor gratuito.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-rueda-de-impacto-comunitario",
    "name": "Rueda de Impacto Comunitario",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Evalúa la huella del cliente en su comunidad inmediata.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-testimonios-historias-de-cambio",
    "name": "Testimonios & Historias de Cambio",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Organiza las historias de transformación más poderosas.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-plan-de-alianzas-estrategicas",
    "name": "Plan de Alianzas Estratégicas",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Identifica con quién puede aliarse para multiplicar impacto.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-auditoria-de-huella-etica",
    "name": "Auditoría de Huella Ética",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Revisa la coherencia entre lo que predica y lo que practica.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "dar-vision-de-impacto-a-10-anos",
    "name": "Visión de Impacto a 10 Años",
    "cat": "DAR",
    "icon": "🌍",
    "desc": "Construye una visión de largo plazo del impacto deseado.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-auditoria-de-creencias-sobre-el-dinero",
    "name": "Auditoría de Creencias sobre el Dinero",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Explora las creencias del cliente en torno a recibir dinero.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-rueda-de-abundancia",
    "name": "Rueda de Abundancia",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Evalúa qué tan abundante se siente el cliente en distintas áreas.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-practica-de-gratitud-semanal",
    "name": "Práctica de Gratitud Semanal",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Registra y refuerza momentos de gratitud durante la semana.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-detector-de-bloqueos-para-recibir",
    "name": "Detector de Bloqueos para Recibir",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Identifica qué le impide al cliente aceptar apoyo o reconocimiento.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-plan-de-autocuidado-del-coach",
    "name": "Plan de Autocuidado del Coach",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Diseña un plan realista de autocuidado para el propio coach.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-balance-vida-trabajo",
    "name": "Balance Vida-Trabajo",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Revisa el equilibrio actual entre trabajo y vida personal.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-celebracion-de-logros",
    "name": "Celebración de Logros",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Documenta y celebra los avances logrados hasta ahora.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-mapa-de-apoyo-y-comunidad",
    "name": "Mapa de Apoyo y Comunidad",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Identifica la red de apoyo real con la que cuenta el cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-auditoria-de-descanso",
    "name": "Auditoría de Descanso",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Revisa la calidad y cantidad de descanso del cliente.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-ritual-de-cierre-de-ciclo",
    "name": "Ritual de Cierre de Ciclo",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Facilita cerrar simbólicamente una etapa antes de abrir otra.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-plan-de-reinversion-en-ti-mismo",
    "name": "Plan de Reinversión en ti Mismo",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Diseña cómo reinvertir ganancias en el propio crecimiento.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  },
  {
    "id": "recibir-vision-de-abundancia-integral",
    "name": "Visión de Abundancia Integral",
    "cat": "RECIBIR",
    "icon": "💫",
    "desc": "Construye una visión de abundancia más allá de lo económico.",
    "fields": [
      {
        "k": "contexto",
        "label": "Contexto del cliente (situación actual)",
        "type": "textarea"
      },
      {
        "k": "nivel",
        "label": "Nivel actual en esta área (1 = muy bajo, 10 = excelente)",
        "type": "range"
      }
    ]
  }
];

module.exports = { TOOLS };
