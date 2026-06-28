export const pressureNodes = [
  {
    id: "KnowledgeSaturation",
    label: "Knowledge Saturation",
    type: "pressure",
    group: "exogenous",
    val: 15,
    academic: {
      definition: "An environmental constraint where informational abundance reduces the necessity for deep epistemic search.",
      role: "Exogenous Constraint",
      causal: "Applies negative pressure on Attention Capital."
    },
    philosophy: {
      metaphor: "Kỷ nguyên Không Ma sát (The Frictionless Era) / Bóng râm ngột ngạt.",
      quote: "Khi mọi câu trả lời đều có sẵn, bộ rễ của chúng ta không còn lý do gì để đâm sâu tìm nước.",
      question: "Sự viên mãn của tri thức có đồng nghĩa với sự cạn kiệt của năng lực?"
    },
    bookReference: "Chương 1 (Câu Hỏi Lớn) & Chương 18 (Thiết Kế Cho Sự Phát Triển)"
  },
  {
    id: "ExistentialOutsourcing",
    label: "Existential Outsourcing",
    type: "pressure",
    group: "exogenous",
    val: 12,
    academic: {
      definition: "The delegation of interpretive and moral processing to external computational systems.",
      role: "Behavioral Pathology",
      causal: "Short-circuits the pipeline before Meaning can form."
    },
    philosophy: {
      metaphor: "Nợ tín dụng nhận thức (Cognitive Debt).",
      quote: "Chúng ta đang mượn sức mạnh của các vị thần để trả giá bằng chính bản thể của mình.",
      question: "Nếu nỗi đau cũng được thuê ngoài, thì ai đang sống cuộc đời bạn?"
    },
    bookReference: "Chương 13 (AI Tác Nhân) & Lời Tựa"
  },
  {
    id: "CognitiveAtrophy",
    label: "Cognitive Atrophy",
    type: "pressure",
    group: "exogenous",
    val: 10,
    academic: {
      definition: "The degradation of meaning construction capacity due to prolonged existential outsourcing.",
      role: "Degenerative State",
      causal: "Result of bypassed Systemic Inquiry and Responsibility."
    },
    philosophy: {
      metaphor: "Sự teo tóp của cơ bắp ý nghĩa / Rễ cây hoại tử.",
      quote: "Sự hỗ trợ hoàn hảo tước đi khả năng tự đứng vững. Khi cỗ máy nghĩ thay, con người quên cách đau khổ.",
      question: "Một thế giới không còn nỗi đau có phải là một thế giới không còn con người?"
    },
    bookReference: "Chương 18 (Thiết Kế Cho Sự Phát Triển) & Chương 20"
  }
];

export const pressureLinks = [
  { source: "KnowledgeSaturation", target: "AttentionCapital", type: "negative", strength: 0.8, layer: "pressure", provenance: "Architecture v1.0", status: "canonical" },
  { source: "ExistentialOutsourcing", target: "SystemicInquiry", type: "negative", strength: 0.8, layer: "pressure", provenance: "HVDT Draft (Ch 13)", status: "canonical" },
  { source: "ExistentialOutsourcing", target: "InterpretiveIdentity", type: "negative", strength: 0.8, layer: "pressure", provenance: "HVDT Draft (Ch 13)", status: "canonical" },
  { source: "CognitiveAtrophy", target: "MCC", type: "negative", strength: 0.9, layer: "pressure", provenance: "HVDT Draft", status: "canonical" }
];
