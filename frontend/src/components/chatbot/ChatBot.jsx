import React, { useState, useRef, useEffect } from "react";
import Button from "../shared/Button";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Enhanced tumor information with detailed classification
  const tumorInfo = {
    glioma: {
      description: [
        "Gliomas are the most common type of primary brain tumor, arising from glial cells that support nerve cells.",
        "They account for about 30% of all brain tumors and 80% of all malignant brain tumors.",
        "Gliomas are classified by cell type (astrocytoma, oligodendroglioma, ependymoma) and grade (I-IV).",
        "Grade IV gliomas (glioblastoma) are the most aggressive, while Grade I are the least aggressive.",
      ],
      symptoms: [
        "Progressive headaches that worsen over time, especially in the morning",
        "Seizures (focal or generalized), which may be the first symptom in 60-70% of cases",
        "Progressive weakness or numbness in arms or legs",
        "Difficulty with speech, language comprehension, or word finding",
        "Personality changes, mood swings, or cognitive decline",
        "Visual disturbances including blurred or double vision",
        "Balance problems, coordination difficulties, or unsteady gait",
        "Memory problems and confusion, especially in frontal lobe gliomas",
      ],
      causes: [
        "Most gliomas occur sporadically without known cause",
        "Genetic syndromes like neurofibromatosis type 1 increase risk",
        "Previous radiation therapy to the head increases risk",
        "Age is a factor - incidence increases with age, peak at 45-65 years",
        "Some hereditary cancer syndromes (Li-Fraumeni syndrome, Lynch syndrome)",
      ],
      treatment: [
        "Surgical resection is the first-line treatment when safely possible",
        "Radiation therapy (typically 60 Gy in 30 fractions for high-grade gliomas)",
        "Chemotherapy with temozolomide for high-grade gliomas",
        "Tumor treating fields (TTFields) for glioblastoma patients",
        "Targeted therapies for tumors with specific genetic mutations",
        "Immunotherapy trials are ongoing for recurrent gliomas",
      ],
      prognosis: [
        "Prognosis varies significantly by glioma grade and molecular features",
        "Low-grade gliomas: median survival 10-15 years with treatment",
        "High-grade gliomas (Grade III): median survival 2-5 years",
        "Glioblastoma (Grade IV): median survival 12-18 months with standard treatment",
        "IDH-mutant gliomas generally have better prognosis than IDH-wildtype",
        "MGMT methylation status affects response to chemotherapy",
      ],
    },
    meningioma: {
      description: [
        "Meningiomas arise from the meninges, the membranes that surround the brain and spinal cord.",
        "They are the most common primary brain tumor, accounting for about 37% of all brain tumors.",
        "Most meningiomas (85-90%) are benign (WHO Grade I), with good prognosis after treatment.",
        "They grow slowly and may be present for years before causing symptoms.",
      ],
      symptoms: [
        "Gradually worsening headaches, often described as dull and persistent",
        "Seizures, particularly in tumors located near the cerebral cortex",
        "Vision problems including loss of visual fields or double vision",
        "Hearing loss or tinnitus (ringing in ears) for skull base meningiomas",
        "Weakness or numbness in extremities, depending on tumor location",
        "Personality changes, mood disorders, or cognitive impairment",
        "Speech difficulties or language problems",
        "Coordination problems and balance issues",
        "Facial numbness or weakness for cavernous sinus meningiomas",
      ],
      causes: [
        "Female hormones may play a role - more common in women (2:1 ratio)",
        "Previous radiation exposure increases risk 10-20 years later",
        "Neurofibromatosis type 2 (NF2) genetic syndrome",
        "Age factor - incidence increases with age, peak at 65-75 years",
        "Hormonal factors - may grow during pregnancy or with hormone replacement",
      ],
      treatment: [
        "Observation with serial imaging for small, asymptomatic tumors",
        "Complete surgical resection when safely achievable (Simpson Grade I-III)",
        "Stereotactic radiosurgery (SRS) for small, surgically inaccessible tumors",
        "Conventional fractionated radiotherapy for large or partially resected tumors",
        "Proton beam therapy for skull base meningiomas near critical structures",
        "Medical management rarely effective, except for progesterone receptor-positive tumors",
      ],
      prognosis: [
        "Excellent prognosis for completely resected benign meningiomas",
        "5-year survival rate >95% for WHO Grade I meningiomas",
        "10-15% recurrence rate after complete resection of benign meningiomas",
        "Atypical meningiomas (Grade II) have 15-20% 5-year recurrence rate",
        "Anaplastic meningiomas (Grade III) have poorer prognosis with higher recurrence",
        "Location affects prognosis - skull base tumors more challenging to treat",
      ],
    },
    pituitary: {
      description: [
        "Pituitary adenomas are benign tumors of the pituitary gland, the 'master gland' of the endocrine system.",
        "They account for 10-15% of all intracranial tumors and are often discovered incidentally.",
        "Classified as microadenomas (<10mm) or macroadenomas (≥10mm) based on size.",
        "Can be functioning (hormone-secreting) or non-functioning adenomas.",
      ],
      symptoms: [
        "Visual field defects, particularly bitemporal hemianopia from optic chiasm compression",
        "Headaches, often described as dull, persistent, and behind the eyes",
        "Hormonal symptoms depending on type: acromegaly, Cushing's disease, prolactinoma",
        "Galactorrhea (milk production) and amenorrhea in prolactinomas",
        "Growth abnormalities in children and adolescents (gigantism)",
        "Fatigue, weakness, and cold intolerance from hypopituitarism",
        "Sexual dysfunction, decreased libido, and infertility",
        "Weight changes - gain in Cushing's disease, loss in hypopituitarism",
        "Mood changes, depression, and cognitive difficulties",
      ],
      causes: [
        "Most pituitary adenomas occur sporadically without known cause",
        "Multiple Endocrine Neoplasia type 1 (MEN1) genetic syndrome",
        "Carney complex and McCune-Albright syndrome (rare genetic causes)",
        "Age factor - most common in 30-50 year age group",
        "Slightly more common in women for some subtypes (prolactinomas)",
      ],
      treatment: [
        "Transsphenoidal surgery for most symptomatic adenomas",
        "Medical management with dopamine agonists for prolactinomas",
        "Somatostatin analogs for growth hormone-secreting adenomas",
        "Radiation therapy for residual or recurrent tumors after surgery",
        "Stereotactic radiosurgery for small, well-defined residual adenomas",
        "Hormone replacement therapy for hypopituitarism after treatment",
      ],
      prognosis: [
        "Excellent prognosis for most pituitary adenomas with appropriate treatment",
        ">95% cure rate for microadenomas with complete surgical resection",
        "80-90% cure rate for macroadenomas with surgery",
        "Medical therapy highly effective for prolactinomas (>90% control rate)",
        "Long-term follow-up needed to monitor for recurrence and hormonal function",
        "Quality of life generally excellent after successful treatment",
      ],
    },
    notumor: {
      description: [
        "Many brain imaging findings initially suspicious for tumors turn out to be benign conditions.",
        "Common non-tumor causes include vascular malformations, infections, and inflammatory conditions.",
        "Differential diagnosis is crucial to avoid unnecessary invasive procedures.",
        "Advanced imaging techniques help distinguish tumors from non-tumor lesions.",
      ],
      conditions: [
        "Vascular malformations: arteriovenous malformations (AVMs), cavernous malformations",
        "Infectious causes: brain abscess, tuberculomas, neurocysticercosis",
        "Inflammatory conditions: multiple sclerosis, sarcoidosis, autoimmune encephalitis",
        "Developmental anomalies: arachnoid cysts, colloid cysts, epidermoid cysts",
        "Metabolic disorders: Wilson's disease, mitochondrial disorders",
        "Post-treatment changes: radiation necrosis, post-surgical changes",
      ],
      symptoms: [
        "Headaches that may mimic those caused by brain tumors",
        "Seizures, particularly with vascular malformations or inflammatory lesions",
        "Neurological deficits that fluctuate with inflammatory conditions",
        "Cognitive changes that may be reversible with treatment",
        "Visual disturbances from lesions affecting visual pathways",
        "Movement disorders from lesions in basal ganglia region",
        "Speech and language difficulties depending on lesion location",
      ],
      diagnosis: [
        "Advanced MRI sequences including perfusion, diffusion, and spectroscopy",
        "PET scanning to assess metabolic activity of lesions",
        "CSF analysis for infectious, inflammatory, or malignant cells",
        "Blood tests for autoimmune markers, infections, and metabolic disorders",
        "Biopsy may be necessary when imaging is inconclusive",
        "Multidisciplinary team approach for complex cases",
      ],
      treatment: [
        "Treatment depends on the underlying condition identified",
        "Antibiotics for bacterial infections, antifungals for fungal infections",
        "Immunosuppressive therapy for inflammatory and autoimmune conditions",
        "Surgical intervention for symptomatic cysts or vascular malformations",
        "Medical management for metabolic disorders",
        "Observation with serial imaging for stable, asymptomatic lesions",
      ],
    },
    general: [
      "Brain lesion classification requires careful analysis of imaging characteristics and clinical presentation.",
      "Multidisciplinary team approach involving neurosurgery, neuro-oncology, and neuroradiology is essential.",
      "Early accurate diagnosis significantly improves patient outcomes and quality of life.",
      "Advanced imaging techniques have revolutionized brain tumor diagnosis and treatment planning.",
      "Molecular testing of tumor tissue provides important prognostic and treatment information.",
    ],
  };

  // Enhanced response generation with more comprehensive information
  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes("hello") ||
      lowerInput.includes("hi") ||
      lowerInput.includes("hey") ||
      lowerInput.includes("start")
    ) {
      return "Hello! I'm here to help you learn about brain tumors. I specialize in gliomas, meningiomas, pituitary adenomas, and non-tumor conditions. What would you like to know?";
    }

    // Glioma-related queries
    else if (
      lowerInput.includes("glioma") ||
      lowerInput.includes("glioblastoma") ||
      lowerInput.includes("astrocytoma")
    ) {
      if (lowerInput.includes("symptom") || lowerInput.includes("sign")) {
        const symptoms = tumorInfo.glioma.symptoms;
        return `Glioma symptoms include: ${
          symptoms[Math.floor(Math.random() * symptoms.length)]
        } Other common symptoms are progressive headaches, seizures, and neurological deficits. Would you like to know about treatment options?`;
      } else if (
        lowerInput.includes("treatment") ||
        lowerInput.includes("therapy")
      ) {
        const treatments = tumorInfo.glioma.treatment;
        return `${
          treatments[Math.floor(Math.random() * treatments.length)]
        } Treatment is typically multimodal, combining surgery, radiation, and chemotherapy.`;
      } else if (lowerInput.includes("cause") || lowerInput.includes("risk")) {
        const causes = tumorInfo.glioma.causes;
        return `${
          causes[Math.floor(Math.random() * causes.length)]
        } Most gliomas occur without identifiable cause.`;
      } else if (
        lowerInput.includes("prognosis") ||
        lowerInput.includes("survival") ||
        lowerInput.includes("outcome")
      ) {
        const prognosis = tumorInfo.glioma.prognosis;
        return `${
          prognosis[Math.floor(Math.random() * prognosis.length)]
        } Prognosis depends heavily on tumor grade and molecular features.`;
      } else {
        const descriptions = tumorInfo.glioma.description;
        return `${
          descriptions[Math.floor(Math.random() * descriptions.length)]
        } Would you like to know about symptoms, treatment, or prognosis?`;
      }
    }

    // Meningioma-related queries
    else if (
      lowerInput.includes("meningioma") ||
      lowerInput.includes("meningeal")
    ) {
      if (lowerInput.includes("symptom") || lowerInput.includes("sign")) {
        const symptoms = tumorInfo.meningioma.symptoms;
        return `Meningioma symptoms include: ${
          symptoms[Math.floor(Math.random() * symptoms.length)]
        } Symptoms often develop gradually due to slow growth.`;
      } else if (
        lowerInput.includes("treatment") ||
        lowerInput.includes("therapy") ||
        lowerInput.includes("surgery")
      ) {
        const treatments = tumorInfo.meningioma.treatment;
        return `${
          treatments[Math.floor(Math.random() * treatments.length)]
        } Treatment choice depends on size, location, and symptoms.`;
      } else if (lowerInput.includes("cause") || lowerInput.includes("risk")) {
        const causes = tumorInfo.meningioma.causes;
        return `${
          causes[Math.floor(Math.random() * causes.length)]
        } Meningiomas are more common in women.`;
      } else if (
        lowerInput.includes("prognosis") ||
        lowerInput.includes("survival") ||
        lowerInput.includes("outcome")
      ) {
        const prognosis = tumorInfo.meningioma.prognosis;
        return `${
          prognosis[Math.floor(Math.random() * prognosis.length)]
        } Most meningiomas have excellent outcomes.`;
      } else {
        const descriptions = tumorInfo.meningioma.description;
        return `${
          descriptions[Math.floor(Math.random() * descriptions.length)]
        } Would you like to know about symptoms or treatment?`;
      }
    }

    // Pituitary-related queries
    else if (
      lowerInput.includes("pituitary") ||
      lowerInput.includes("adenoma") ||
      lowerInput.includes("hormone")
    ) {
      if (lowerInput.includes("symptom") || lowerInput.includes("sign")) {
        const symptoms = tumorInfo.pituitary.symptoms;
        return `Pituitary adenoma symptoms include: ${
          symptoms[Math.floor(Math.random() * symptoms.length)]
        } Symptoms can be from mass effect or hormonal dysfunction.`;
      } else if (
        lowerInput.includes("treatment") ||
        lowerInput.includes("therapy") ||
        lowerInput.includes("surgery")
      ) {
        const treatments = tumorInfo.pituitary.treatment;
        return `${
          treatments[Math.floor(Math.random() * treatments.length)]
        } Treatment depends on tumor size and hormone secretion.`;
      } else if (lowerInput.includes("cause") || lowerInput.includes("risk")) {
        const causes = tumorInfo.pituitary.causes;
        return `${
          causes[Math.floor(Math.random() * causes.length)]
        } Most develop spontaneously.`;
      } else if (
        lowerInput.includes("prognosis") ||
        lowerInput.includes("survival") ||
        lowerInput.includes("outcome")
      ) {
        const prognosis = tumorInfo.pituitary.prognosis;
        return `${
          prognosis[Math.floor(Math.random() * prognosis.length)]
        } Pituitary adenomas generally have excellent outcomes.`;
      } else {
        const descriptions = tumorInfo.pituitary.description;
        return `${
          descriptions[Math.floor(Math.random() * descriptions.length)]
        } Would you like information about symptoms or treatment?`;
      }
    }

    // No tumor / benign conditions
    else if (
      lowerInput.includes("no tumor") ||
      lowerInput.includes("not tumor") ||
      lowerInput.includes("benign") ||
      lowerInput.includes("non-tumor")
    ) {
      if (lowerInput.includes("condition") || lowerInput.includes("cause")) {
        const conditions = tumorInfo.notumor.conditions;
        return `Non-tumor brain lesions include: ${
          conditions[Math.floor(Math.random() * conditions.length)]
        } Many brain abnormalities are not tumors.`;
      } else if (
        lowerInput.includes("symptom") ||
        lowerInput.includes("sign")
      ) {
        const symptoms = tumorInfo.notumor.symptoms;
        return `Non-tumor brain lesions can cause: ${
          symptoms[Math.floor(Math.random() * symptoms.length)]
        } Symptoms can overlap with tumor symptoms.`;
      } else if (
        lowerInput.includes("diagnosis") ||
        lowerInput.includes("test")
      ) {
        const diagnosis = tumorInfo.notumor.diagnosis;
        return `${
          diagnosis[Math.floor(Math.random() * diagnosis.length)]
        } Distinguishing tumors from non-tumor lesions requires expertise.`;
      } else if (lowerInput.includes("treatment")) {
        const treatment = tumorInfo.notumor.treatment;
        return `${
          treatment[Math.floor(Math.random() * treatment.length)]
        } Treatment varies by condition.`;
      } else {
        const descriptions = tumorInfo.notumor.description;
        return `${
          descriptions[Math.floor(Math.random() * descriptions.length)]
        } Would you like to know about specific conditions?`;
      }
    }

    // General symptom queries
    else if (lowerInput.includes("symptom") || lowerInput.includes("sign")) {
      return "Symptoms vary by tumor type. Gliomas often cause seizures and progressive deficits. Meningiomas cause gradual headaches. Pituitary adenomas cause vision and hormone problems. Which type interests you?";
    }

    // General treatment queries
    else if (
      lowerInput.includes("treatment") ||
      lowerInput.includes("therapy")
    ) {
      return "Treatment differs by type: Gliomas need surgery, radiation, and chemotherapy. Meningiomas often need surgery or radiation. Pituitary adenomas may need surgery, medication, or radiation. Which would you like to learn about?";
    }

    // Comparison queries
    else if (
      lowerInput.includes("difference") ||
      lowerInput.includes("compare") ||
      lowerInput.includes("distinguish")
    ) {
      return "Key differences: Gliomas arise from brain tissue and are often malignant. Meningiomas grow from brain coverings and are usually benign. Pituitary adenomas affect hormones. Non-tumor lesions include infections and inflammation. Which comparison interests you?";
    }

    // Prognosis queries
    else if (
      lowerInput.includes("prognosis") ||
      lowerInput.includes("survival") ||
      lowerInput.includes("outlook") ||
      lowerInput.includes("cure")
    ) {
      return "Prognosis varies: Meningiomas and pituitary adenomas have excellent outcomes (>90% cure rates). Gliomas range from 10+ years for low-grade to 12-18 months for glioblastoma. Which condition would you like details about?";
    }

    // Thank you responses
    else if (lowerInput.includes("thank")) {
      return "You're welcome! Feel free to ask about gliomas, meningiomas, pituitary adenomas, or non-tumor conditions.";
    }

    // Default response
    else {
      return `${
        tumorInfo.general[Math.floor(Math.random() * tumorInfo.general.length)]
      } I can help with information about gliomas, meningiomas, pituitary adenomas, and non-tumor lesions. What interests you?`;
    }
  };

  // Function to handle user messages and generate responses
  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const response = generateResponse(input.toLowerCase());
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Clean chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Clean chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Simple header */}
          <div className="bg-blue-600 p-4 text-white">
            <h3 className="font-semibold text-lg">Brain Tumor Assistant</h3>
            <p className="text-xs text-blue-100 mt-1">
              Ask about gliomas, meningiomas, pituitary tumors
            </p>
          </div>

          {/* Clean messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-700 mb-2">
                  How can I help?
                </h4>
                <p className="text-sm text-gray-500 max-w-xs">
                  Ask me about brain tumor symptoms, treatments, or any
                  questions you have.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Simple input area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about symptoms, treatment, prognosis..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={handleSendMessage}
                disabled={input.trim() === ""}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
