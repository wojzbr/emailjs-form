import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import "./form.css";

emailjs.init({ publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY });

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const formRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setFeedback("Please complete the CAPTCHA.");
      return;
    }

    setIsSending(true);

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          reply_to: formData.email,
          message: formData.message,
          "g-recaptcha-response": captchaToken,
        }
      )
      .then(
        () => {
          setFeedback("Email sent successfully!");
          setFormData({ name: "", email: "", message: "" });
          setCaptchaToken(null);
          setIsSending(false);
        },
        (error) => {
          setFeedback("Failed to send email. Please try again.");
          console.error(error);
          setIsSending(false);
        }
      );
  };

  return (
    <form className="form-container" ref={formRef} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          className="form-textarea"
        />
      </div>
      <div className="form-group">
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={onCaptchaChange}
          className="form-recaptcha"
        />
      </div>
      <button type="submit" disabled={isSending} className="form-button">
        {isSending ? "Sending..." : "Send"}
      </button>
      {feedback && <p className="form-feedback">{feedback}</p>}
    </form>
  );
};

export default Form;
