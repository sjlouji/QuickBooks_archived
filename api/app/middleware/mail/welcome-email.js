const sgMail = require("@sendgrid/mail");
const config  = require('config')

sgMail.setApiKey(config.SENDGRIDKEY);
let templates = {
    password_reset_confirm: "d-3dc848ac53f4450795bfc549e81876f2",
    password_reset        : "d-bdbc5ebbc34a4b09886dad7c179e9fea ",
    confirm_account       : "d-21c8486fe204428da8c6e50af05684bf",
};
function welcomeEmail(data) {
   const msg = {
      to: data.email,
      from: 'nexdoh@gmail.com',
      templateId: 'd-21c8486fe204428da8c6e50af05684bf',
      dynamic_template_data: {
         user_name: data.first_name,
      }
    };
    sgMail.send(msg, (error, result) => {
      if (error) {
          console.log(error);
      } else {
          console.log("Mail Send");
      }
    });
}
exports.welcomeEmail = welcomeEmail;