export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Паролата трябва да е поне 8 символа");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Паролата трябва да съдържа поне една главна буква");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Паролата трябва да съдържа поне една малка буква");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Паролата трябва да съдържа поне една цифра");
  }

  return errors;
};

export const validateUsername = (username: string): string[] => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push("Потребителското име трябва да е поне 3 символа");
  }
  if (username.length > 20) {
    errors.push("Потребителското име не може да е по-дълго от 20 символа");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push(
      "Потребителското име може да съдържа само букви, цифри и долна черта"
    );
  }

  return errors;
};
