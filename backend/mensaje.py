import smtplib

class Mensaje:

  CARRIERS = {
      "gmail": "@gmail.com"
  }
  # EMAIL PROYECTO
  EMAIL = "danielamu1209@gmail.com"
  # CONTRASEÑA GENERADA DESDE GMAIL
  PASSWORD = "uzwrinzsioqzkjal"

  def __init__(self, email):
        self.email = email

  def enviar_correo(self, destinatario, texto):
        recipient = destinatario
        if not recipient:
            return "Carrier no válido."

        message = f"Subject: Notificacion\n\n{texto}"

        try:
            enviar = smtplib.SMTP("smtp.gmail.com", 587)
            enviar.starttls()
            print(self.EMAIL, self.PASSWORD)
            enviar.login(self.EMAIL, self.PASSWORD)
            enviar.sendmail(self.EMAIL,recipient, message)
            enviar.quit()
            return f"Correo enviado a {recipient}"
        except Exception as e:
            return f"Error al enviar el correo: {e}"

  def recibir(self):
        return f"Este es el método recibir mensaje"

  def marcar_leido(self):
        return f"Este es el método marcar mensaje"

# Crear una instancia
mi_mensaje = Mensaje("tucorreo@gmail.com")

# Ejemplo de uso de métodos
print(mi_mensaje.enviar_correo("leonmafe788@gmail.com", "Holiiis ya se pudo :3"))
print(mi_mensaje.recibir())
print(mi_mensaje.marcar_leido())