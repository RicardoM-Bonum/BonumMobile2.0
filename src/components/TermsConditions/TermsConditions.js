import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Calendar from '../Calendar';
import Advice from '../../pages/CoacheeCalendar/components/Advice';
import {useCoachCalendar} from '../../hooks';
import {PrimaryButton} from '../Buttons';

export default function TermsConditions({isOpen, onClose}) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        style={tw.style('justify-center items-center my-4')}>
        <View
          style={tw.style(
            'px-6 py-8 mx-6 my-14 bg-white shadow-md rounded-3xl my-auto max-h-[80%]',
          )}>
          <ScrollView>
            <Text style={styles.title}>
              TERMINOS Y CONDICIONES BONUM COACHING LLC
            </Text>
            <Text style={styles.subtitle}>TERMINOS Y CONDICIONES</Text>
            <Text style={styles.paragraph}>
              El presente documento tiene como finalidad el establecer y regular
              las normas de acceso a nuestros servicios, uso de este portal web
              y aplicación móvil entendiendo por éste todas las páginas y sus
              contenidos propiedad de BONUM COACHING LLC con domicilio en 1761
              NE 197th Terrace, Miami, FL 33179 USA, en adelante (‘’La Empresa,
              BONUM’’) a las cuales se accede a través del dominio{' '}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL('https://app.bonumcoaching.com/')
                }>
                https://app.bonumcoaching.com/
              </Text>
              .
            </Text>
            <Text style={styles.paragraph}>
              La utilización del portal web atribuye la condición de usuario del
              mismo e implica la aceptación de todas las condiciones incluidas
              en el presente Aviso Legal. El usuario en adelante ‘’coach
              profesional, coachee y/o contratante’’ se comprometen a leer
              atentamente el presente Aviso Legal en cada una de las ocasiones
              en que se proponga utilizar nuestro portal web ya que éste y sus
              condiciones de uso recogidas en el presente Aviso Legal pueden
              sufrir modificaciones.
            </Text>
            <Text style={styles.subtitle}>
              ACEPTACIÓN DE LOS TÉRMINOS Y CONDICIONES GENERALES.
            </Text>
            <Text style={styles.paragraph}>
              El registro en la web y/o en la aplicación móvil de BONUM y la
              prestación del servicio dependerá de la aceptación de estas
              condiciones, por lo que cualquier Coach profesional, contratante
              y/o coachee que no esté de acuerdo o no se comprometa a
              comportarse de acuerdo con éstas, no podrá utilizar dicho
              servicio.
            </Text>
            <Text style={styles.paragraph}>
              De esta forma, para cada persona que es un Coach profesional,
              contratante, o coachee del servicio que ofrece BONUM se asume
              mediante el registro, que ha leído completamente los Términos y
              Condiciones y la Política de Privacidad, aceptado expresamente
              ambos.
            </Text>
            <Text style={styles.paragraph}>
              BONUM se reserva el derecho de cambiar en cualquier momento y sin
              previo aviso los Términos y Condiciones (parcial o totalmente), y
              cada nueva versión de los Términos y Condiciones entrará en vigor
              después de su publicación en el sitio web. Al aceptar estos
              Términos y Condiciones, los usuarios se comprometen a visitar y
              estudiar estos términos con regularidad.
            </Text>
            <Text style={styles.subtitle}>
              VINCULACIÓN A LAS PRESENTES DISPOSICIONES
            </Text>
            <Text style={styles.paragraph}>
              A partir del momento en que el Coach profesional, el contratante
              y/o el coachee aceptan estos Términos están siendo vinculado
              legalmente a las estipulaciones y aceptando someterse a las
              versiones más actuales de estos términos, de la Política de
              Privacidad y demás contratos alternos producto de la presente
              relación y servicio.
            </Text>
            <Text style={styles.paragraph}>
              Podrá retirar su consentimiento en cualquier momento y, así,
              proceder a la revocación de este contrato, no pudiendo ser
              reconocido ningún derecho compensatorio o devolución de los
              importes ya pagados.
            </Text>
            <Text style={styles.paragraph}>
              Las presentes disposiciones se aplicarán entre las partes durante
              toda la duración del servicio que se determinará en función del
              plan como profesional, como contratante y/o como coachee.
            </Text>
            <Text style={styles.subtitle}>REGISTRO Y USUARIOS AUTORIZADOS</Text>
            <Text style={styles.paragraph}>
              Si desea acceder y utilizar los Servicios, debe crear una cuenta
              ("Cuenta"). Es importante que nos proporcione información precisa,
              completa y actualizada para su Cuenta. Si no lo hace, es posible
              que tengamos que suspender o cancelar su Cuenta. Usted acepta que
              no revelará la contraseña de su Cuenta a nadie y nos notificará
              inmediatamente de cualquier uso no autorizado de su Cuenta.
            </Text>
            <Text style={styles.paragraph}>
              Los usuarios deberán proveer la siguiente información, y seguir
              las instrucciones descriptas:
            </Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>
                • Nombre completo (nombre y apellido);
              </Text>
              <Text style={styles.listItem}>• Género;</Text>
              <Text style={styles.listItem}>• Correo electrónico;</Text>
              <Text style={styles.listItem}>• Creación de contraseña;</Text>
              <Text style={styles.listItem}>• País de residencia;</Text>
              <Text style={styles.listItem}>
                • Empresa para la que trabajan;
              </Text>
              <Text style={styles.listItem}>• Profesión;</Text>
              <Text style={styles.listItem}>
                • Adicionalmente los Coach Profesionales deberán proveer sus
                respectivas credenciales, certificaciones, y/o diplomas.
              </Text>
              <Text style={styles.listItem}>
                • Los Coachees deberán contar con previa autorización de ingreso
                derivada de la previa contratación con la entidad Contratante.
              </Text>
              <Text style={styles.listItem}>
                • Los Contratantes del servicio de BONUM COACHING destinarán los
                servicios a un grupo determinado de coachees, cada uno de estos
                será presentado con 3 coaches profesionales, debiendo el coachee
                seleccionar a un coach para su proceso.
              </Text>
              <Text style={styles.listItem}>
                • El Grupo seleccionado, recibirá 12 sesiones de coaching
                ejecutivo individual de manera virtual, cada sesión tendrá una
                duración de aproximadamente 30 minutos cada 2 semanas.
              </Text>
              <Text style={styles.listItem}>
                • Al comenzar el proceso el coachee deberá realizar una
                evaluación 360 que será utilizada para ayudarlos en el proceso
                de coaching. Al finalizar el proceso, se volverá a realizar la
                encuesta para determinar el avance obtenido.
              </Text>
              <Text style={styles.listItem}>
                • Durante el primer mes del servicio, el coachee podrá realizar
                un cambio de coach si no está satisfecho con el coach elegido,
                no pudiendo cambiar nuevamente de coach.
              </Text>
              <Text style={styles.listItem}>
                • Al finalizar la sesión, el coach agregará en la plataforma los
                puntos y avances obtenidos en la sesión y algunas tareas o
                asignaciones para que el coachee las realice antes de su próxima
                sesión.
              </Text>
              <Text style={styles.listItem}>
                • El coachee deberá marcar las tareas como finalizadas una vez
                realizadas.
              </Text>
              <Text style={styles.subtitle}>OBLIGACIONES DE LOS USUARIOS</Text>
              <Text style={styles.paragraph}>
                Los usuarios deberán utilizar el servicio de BONUM de
                conformidad con la legislación aplicable, con las normas de
                moralidad y las buenas costumbres generalmente aceptadas y el
                orden público. Queda estrictamente prohibido:
              </Text>
              <View style={styles.list}>
                <Text style={styles.listItem}>
                  • Utilizar el servicio de BONUM para fines ilícitos o no
                  autorizados;
                </Text>
                <Text style={styles.listItem}>
                  • Crear perfiles falsos, fraudulentos o suplantar la identidad
                  de otras personas físicas o jurídicas;
                </Text>
                <Text style={styles.listItem}>
                  • Realizar actividades que puedan desestabilizar, interrumpir
                  o perjudicar el funcionamiento del sistema;
                </Text>
                <Text style={styles.listItem}>
                  • Facilitar el acceso de terceros no autorizados a los
                  servicios ofrecidos en la plataforma.
                </Text>
              </View>

              <Text style={styles.subtitle}>POLÍTICA DE CANCELACIÓN</Text>
              <Text style={styles.paragraph}>
                En caso de que un usuario decida cancelar el servicio, deberá
                enviar un correo electrónico a{' '}
                <Text
                  style={styles.link}
                  onPress={() =>
                    Linking.openURL('mailto:contacto@bonumcoaching.com')
                  }>
                  contacto@bonumcoaching.com
                </Text>{' '}
                explicando los motivos de su decisión. BONUM se reserva el
                derecho de aceptar o denegar dicha cancelación, y de cobrar
                cualquier saldo pendiente de acuerdo con las condiciones
                acordadas en el contrato.
              </Text>

              <Text style={styles.subtitle}>
                LIMITACIONES DE RESPONSABILIDAD
              </Text>
              <Text style={styles.paragraph}>
                BONUM no será responsable por cualquier daño, pérdida o
                perjuicio que surja como resultado del uso del servicio,
                incluyendo, pero no limitándose a, fallos técnicos, errores
                humanos o de sistema, interrupciones en el acceso o la calidad
                del servicio, entre otros. El usuario acepta utilizar el
                servicio bajo su propio riesgo.
              </Text>

              <Text style={styles.subtitle}>PROPIEDAD INTELECTUAL</Text>
              <Text style={styles.paragraph}>
                Todo el contenido de BONUM, incluyendo textos, imágenes,
                logotipos, software, bases de datos, y cualquier otro material
                protegido por derechos de autor, marcas registradas, patentes u
                otros derechos de propiedad intelectual, es propiedad exclusiva
                de BONUM o de terceros que han autorizado su uso. Queda
                prohibida la reproducción, distribución o modificación de este
                contenido sin el consentimiento previo por escrito de BONUM.
              </Text>

              <Text style={styles.subtitle}>CONFIDENCIALIDAD</Text>
              <Text style={styles.paragraph}>
                BONUM y sus usuarios se comprometen a mantener la
                confidencialidad de toda la información intercambiada en virtud
                del servicio, incluyendo datos personales, conversaciones,
                materiales de coaching, entre otros. Este compromiso seguirá
                vigente incluso después de la terminación del contrato.
              </Text>

              <Text style={styles.subtitle}>DURACIÓN DEL CONTRATO</Text>
              <Text style={styles.paragraph}>
                Este contrato permanecerá en vigor durante todo el período en
                que el usuario utilice los servicios de BONUM, salvo que se
                rescinda por alguna de las partes conforme a las condiciones
                estipuladas en este documento.
              </Text>

              <Text style={styles.subtitle}>RESOLUCIÓN DE CONTROVERSIAS</Text>
              <Text style={styles.paragraph}>
                En caso de controversias derivadas del uso del servicio, las
                partes acuerdan someterse a la jurisdicción y competencia de los
                tribunales del estado de Florida, EE.UU., renunciando
                expresamente a cualquier otro fuero que pudiera corresponderles.
              </Text>

              <Text style={styles.subtitle}>CONTACTO</Text>
              <Text style={styles.paragraph}>
                Para cualquier consulta relacionada con estos términos y
                condiciones, los usuarios pueden comunicarse a través del correo
                electrónico{' '}
                <Text
                  style={styles.link}
                  onPress={() =>
                    Linking.openURL('mailto:contacto@bonumcoaching.com')
                  }>
                  contacto@bonumcoaching.com
                </Text>{' '}
                o utilizando los medios de contacto disponibles en nuestro sitio
                web.
              </Text>
            </View>
          </ScrollView>
          <PrimaryButton
            onPress={onClose}
            title="Cerrar"
            style={tw.style('bg-[#707070] mt-6')}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
