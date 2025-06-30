import clsx from "clsx";
import { useRef, useState } from "react";

const Form = () => {
  const firstNameRef = useRef(null);
  const [firstNameError, setFirstNameError] = useState(false);

  const lastNameRef = useRef(null);
  const [lastNameError, setLastNameError] = useState(false);

  const emailRef = useRef(null);
  const [emailError, setEmailError] = useState(false);

  const [queryType, setQueryType] = useState("");
  const [queryError, setQueryError] = useState(false);

  const messageRef = useRef(null);
  const [messageError, setMessageError] = useState(false);

  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const query = queryType;
    const message = messageRef.current.value.trim();
    const consentGiven = consent;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const firstNameErr = firstName === "";
    const lastNameErr = lastName === "";
    const emailErr = !emailPattern.test(email);
    const messageErr = message === "";
    const queryErr = query === "";
    const consentErr = !consentGiven;

    setFirstNameError(firstNameErr);
    setLastNameError(lastNameErr);
    setEmailError(emailErr);
    setQueryError(queryErr);
    setMessageError(messageErr);
    setConsentError(consentErr);

    let hasError = true;

    if (
      !firstNameErr &&
      !lastNameErr &&
      !emailErr &&
      !queryErr &&
      !messageErr &&
      !consentErr
    ) {
      hasError = false;
      // Show alert
      window.dispatchEvent(
        new CustomEvent("submission-success", {
          detail: "Thanks for completing the form. We'll be in touch soon!",
        })
      );

      // Reset form fields
      firstNameRef.current.value = "";
      lastNameRef.current.value = "";
      emailRef.current.value = "";
      setQueryType("");
      messageRef.current.value = "";
      setConsent(false);
    }

    const scrollAndFocus = (el) => {
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.focus(), 300);
    };

    if (!hasError) {
      const form = document.querySelector("form");
      form.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (firstNameErr) {
      scrollAndFocus(firstNameRef.current);
    } else if (lastNameErr) {
      scrollAndFocus(lastNameRef.current);
    } else if (emailErr) {
      scrollAndFocus(emailRef.current);
    } else if (queryErr) {
      const queryType = document.querySelector(".query-type");
      scrollAndFocus(queryType);
    } else if (messageErr) {
      scrollAndFocus(messageRef.current);
    } else if (consentErr) {
      const consentCheckbox = document.querySelector("#consent");
      scrollAndFocus(consentCheckbox);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        const target = e.target;
        const isSubmitBtn =
          target.tagName === "BUTTON" &&
          target.getAttribute("type") === "submit";

        if (e.key === "Enter" && !isSubmitBtn) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col md:flex-row gap-5 w-full">
        {/* First Name */}
        <div className="space-y-2 basis-1/2 min-w-0">
          <label className="flex flex-col gap-2">
            <p>
              First Name{" "}
              <span className="text-[var(--contact-form-accent)] pl-2 font-bold">
                *
              </span>
            </p>
            <input
              ref={firstNameRef}
              type="text"
              required
              data-error={firstNameError}
              aria-invalid={firstNameError}
              aria-describedby="first-name-error"
              className=""
              id="first-name"
              name="first-name"
              autoComplete="given-name"
            />
          </label>
          {!!firstNameError && (
            <p
              id="first-name-error"
              className="text-[var(--contact-form-error)]"
            >
              This field is required
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2 basis-1/2 min-w-0">
          <label className="flex flex-col gap-2">
            <p>
              Last Name{" "}
              <span className="text-[var(--contact-form-accent)] pl-2 font-bold">
                *
              </span>
            </p>
            <input
              ref={lastNameRef}
              type="text"
              required
              data-error={lastNameError}
              aria-invalid={lastNameError}
              aria-describedby="last-name-error"
              className=""
              id="last-name"
              name="last-name"
              autoComplete="family-name"
            />
          </label>
          {!!lastNameError && (
            <p
              id="last-name-error"
              className="text-[var(--contact-form-error)]"
            >
              This field is required
            </p>
          )}
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <label className="flex flex-col gap-2 w-full">
          <p>
            Email Address{" "}
            <span className="text-[var(--contact-form-accent)] pl-2 font-bold">
              *
            </span>
          </p>
          <input
            ref={emailRef}
            type="email"
            required
            data-error={emailError}
            aria-invalid={emailError}
            aria-describedby="email-error"
            className=""
            id="email"
            name="email"
            autoComplete="email"
          />
        </label>
        {!!emailError && (
          <p id="email-error" className="text-[var(--contact-form-error)]">
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* Query Type */}
      <div className="flex flex-col gap-2 w-full">
        <p>
          Query Type{" "}
          <span className="text-[var(--contact-form-accent)] pl-2 font-bold">
            *
          </span>
        </p>
        <fieldset
          role="radiogroup"
          aria-label="Query Type"
          className="flex flex-col md:flex-row gap-5"
        >
          <label
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setQueryType("general");
              }
            }}
            className={clsx("query-type", queryType === "general" && "active")}
          >
            <input
              type="radio"
              required
              id="query-type-general"
              name="query-type"
              checked={queryType === "general"}
              onChange={() => {
                setQueryType("general");
              }}
              className="appearance-none w-[1.3rem] h-[1.3rem] aspect-square border-[1.5px] border-[var(--contact-form-grey)] rounded-full cursor-pointer checked:hidden"
            />
            {queryType === "general" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="none"
                viewBox="0 0 21 21"
              >
                <path
                  fill="#0C7D69"
                  d="M10 .75a9.75 9.75 0 1 0 9.75 9.75A9.76 9.76 0 0 0 10 .75Zm0 18a8.25 8.25 0 1 1 8.25-8.25A8.26 8.26 0 0 1 10 18.75Zm5.25-8.25a5.25 5.25 0 1 1-10.499 0 5.25 5.25 0 0 1 10.499 0Z"
                />
              </svg>
            )}
            <p>General Enquiry</p>
          </label>

          <label
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setQueryType("support");
              }
            }}
            className={clsx("query-type", queryType === "support" && "active")}
          >
            <input
              type="radio"
              id="query-type-support"
              name="query-type"
              checked={queryType === "support"}
              onChange={() => {
                setQueryType("support");
              }}
              className="appearance-none w-[1.3rem] h-[1.3rem] aspect-square border-[1.5px] border-[var(--contact-form-grey)] rounded-full cursor-pointer checked:hidden"
            />
            {queryType === "support" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="none"
                viewBox="0 0 21 21"
              >
                <path
                  fill="#0C7D69"
                  d="M10 .75a9.75 9.75 0 1 0 9.75 9.75A9.76 9.76 0 0 0 10 .75Zm0 18a8.25 8.25 0 1 1 8.25-8.25A8.26 8.26 0 0 1 10 18.75Zm5.25-8.25a5.25 5.25 0 1 1-10.499 0 5.25 5.25 0 0 1 10.499 0Z"
                />
              </svg>
            )}
            <p>Support Request</p>
          </label>
        </fieldset>
        {!!queryError && (
          <p className="text-[var(--contact-form-error)]">
            Please select a query type
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="flex flex-col gap-2 w-full">
          <p>
            Message{" "}
            <span className="text-[var(--contact-form-accent)] pl-2 font-bold">
              *
            </span>
          </p>
          <textarea
            ref={messageRef}
            required
            data-error={messageError}
            aria-invalid={messageError}
            aria-describedby="message-error"
            rows="3"
            id="message"
            name="message"
          />
        </label>
        {!!messageError && (
          <p id="message-error" className="text-[var(--contact-form-error)]">
            This field is required
          </p>
        )}
      </div>

      {/* Consent Check */}
      <div className="space-y-2">
        <label
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setConsent((prev) => !prev);
            }
          }}
          className="flex items-center gap-4 mt-4 hover:cursor-pointer"
        >
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={() => {
              setConsent((prev) => !prev);
            }}
            id="consent"
            name="consent"
            className="appearance-none w-4.5 h-4.5 border-[1.5px] border-[var(--contact-form-grey)] rounded-xs cursor-pointer checked:hidden"
          />
          {!!consent && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                fill="#0C7D69"
                d="M16.5 0h-15A1.5 1.5 0 0 0 0 1.5v15A1.5 1.5 0 0 0 1.5 18h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 16.5 0Zm-3.22 7.28-5.25 5.25a.748.748 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72 4.72-4.72a.751.751 0 0 1 1.06 1.06Z"
              />
            </svg>
          )}
          <p>I consent to being contacted by the team </p>
        </label>
        {!!consentError && (
          <p className="text-[var(--contact-form-error)]">
            To submit this form, please consent to being contacted
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[var(--contact-form-accent)] text-white py-3 rounded-md text-lg font-semibold cursor-pointer hover:bg-[var(--contact-form-accent-dark)] focus:bg-[var(--contact-form-accent-dark)] mt-2"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
