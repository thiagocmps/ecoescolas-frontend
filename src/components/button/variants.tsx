export interface ButtonStyle {
  button: {
    backgroundColor: string; // azul
    borderWidth?: number;
    borderColor?: string; // azul
  };
  title: {
    color: string;
  };
  icon: {
    color: string;
  };
}

export interface ButtonVariant {
    enabled: ButtonStyle;
    disabled: ButtonStyle;
}

export const primaryButton: ButtonVariant = {
    enabled: {
        button: {
            backgroundColor: "tomato", 
          },
          title: {
            color: "#ffffff", // branco
          },
          icon: {
            color: "#ffffff", // branco
          },
    },
    disabled: {
        button: {
            backgroundColor: "#ccc", // cor de fundo quando desabilitado
          },
          title: {
            color: "#ffffff", 
          },
          icon: {
            color: "#ffffff",
          },
    }
}


export const outlinedButton: ButtonVariant = {
    enabled: {
        button: {
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: "tomato", // azul
          },
          title: {
            color: "tomato", // branco
          },
          icon: {
            color: "tomato", // branco
          },
    },
    disabled: {
        button: {
            backgroundColor: "transparent", // cor de fundo quando desabilitado
            borderWidth: 1.5,
            borderColor: "#ccc", // azul
          },
          title: {
            color: "#ccc", 
          },
          icon: {
            color: "#ccc",
          },
    }
}

export const variants = {
    primary: primaryButton,
    outlined: outlinedButton,
}