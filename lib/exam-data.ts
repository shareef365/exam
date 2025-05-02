// Sample exam data for different exams
// In a real application, this would come from a database

export interface Question {
  id: number
  question: string
  options: { id: string; text: string }[]
  correctAnswer?: string
  image?: string
  subject: string
  explanation?: string
}

export interface ExamData {
  id: string
  name: string
  fullName: string
  description: string
  duration: string
  markingScheme: {
    correct: number
    incorrect: number
  }
  sections: {
    physics: {
      questions: Question[]
    }
    chemistry: {
      questions: Question[]
    }
    mathematics: {
      questions: Question[]
    }
  }
}

const jeeMainData: ExamData = {
  id: "jee-main",
  name: "JEE Main",
  fullName: "Joint Entrance Examination (Main)",
  description:
    "JEE Main is a standardized test conducted for admission to various engineering colleges in India. It is constituted by two papers - Paper 1 and Paper 2. Paper 1 is for admission to B.E./B.Tech courses and is conducted in a Computer Based Test (CBT) mode. Paper 2 is for admission to B.Arch and B.Planning courses.",
  duration: "3 hours",
  markingScheme: {
    correct: 4,
    incorrect: 1,
  },
  sections: {
    physics: {
      questions: [
        {
          id: 1,
          question:
            "A particle moves in a straight line with constant acceleration. If the velocity of the particle is 10 m/s at t = 0 and 20 m/s at t = 2 s, what is the velocity at t = 5 s?",
          options: [
            { id: "a", text: "25 m/s" },
            { id: "b", text: "30 m/s" },
            { id: "c", text: "35 m/s" },
            { id: "d", text: "40 m/s" },
          ],
          correctAnswer: "c",
          subject: "Physics",
          explanation:
            "The acceleration is (20 - 10)/2 = 5 m/s². Using v = u + at, at t = 5s, v = 10 + 5 × 5 = 35 m/s.",
        },
        {
          id: 2,
          question:
            "A body of mass 2 kg is thrown upwards with a velocity of 20 m/s. What is the kinetic energy at the highest point? (g = 10 m/s²)",
          options: [
            { id: "a", text: "0 J" },
            { id: "b", text: "200 J" },
            { id: "c", text: "400 J" },
            { id: "d", text: "800 J" },
          ],
          correctAnswer: "a",
          subject: "Physics",
          explanation: "At the highest point, the velocity becomes zero. Hence, the kinetic energy is zero.",
        },
        {
          id: 3,
          question:
            "A projectile is fired with an initial velocity of 50 m/s at an angle of 30° to the horizontal. What is the maximum height reached by the projectile? (g = 10 m/s²)",
          options: [
            { id: "a", text: "31.25 m" },
            { id: "b", text: "62.5 m" },
            { id: "c", text: "125 m" },
            { id: "d", text: "250 m" },
          ],
          correctAnswer: "a",
          subject: "Physics",
          explanation: "Maximum height = (v₀sinθ)²/(2g) = (50×sin30°)²/(2×10) = (50×0.5)²/20 = 625/20 = 31.25 m",
        },
        {
          id: 4,
          question:
            "A uniform rod of length L and mass M is pivoted at one end. What is the moment of inertia about the pivot?",
          options: [
            { id: "a", text: "ML²/2" },
            { id: "b", text: "ML²/3" },
            { id: "c", text: "ML²/4" },
            { id: "d", text: "ML²/6" },
          ],
          correctAnswer: "b",
          subject: "Physics",
          explanation:
            "The moment of inertia of a uniform rod about an axis passing through one end and perpendicular to the rod is ML²/3.",
        },
        {
          id: 5,
          question:
            "Two identical conducting spheres, having positive charges Q₁ and Q₂, are separated by a distance r. If they are made to touch each other and then separated to the same distance r, the new force between them will be:",
          options: [
            { id: "a", text: "Increased" },
            { id: "b", text: "Decreased" },
            { id: "c", text: "Unchanged" },
            { id: "d", text: "Zero" },
          ],
          correctAnswer: "b",
          subject: "Physics",
          explanation:
            "When the spheres touch, the charges are redistributed equally: Q' = (Q₁ + Q₂)/2. The new force is proportional to Q'², which is less than the original force proportional to Q₁Q₂ (by AM-GM inequality).",
        },
        {
          id: 6,
          question:
            "A simple pendulum has a time period T. If its length is increased by 21% and the acceleration due to gravity decreases by 16%, the new time period will be:",
          options: [
            { id: "a", text: "1.1T" },
            { id: "b", text: "1.2T" },
            { id: "c", text: "1.3T" },
            { id: "d", text: "1.4T" },
          ],
          correctAnswer: "c",
          subject: "Physics",
          image: "/placeholder.svg?height=200&width=300",
          explanation:
            "T = 2π√(L/g). If L increases by 21% and g decreases by 16%, the new period T' = 2π√(1.21L/0.84g) = 2π√(L/g)×√(1.21/0.84) = T×√(1.21/0.84) = T×1.2 = 1.2T.",
        },
        {
          id: 7,
          question:
            "A particle executes simple harmonic motion with a time period of 2 seconds. At t = 0, it is at the mean position and moving with a velocity of 5 cm/s. The amplitude of the motion is:",
          options: [
            { id: "a", text: "5/π cm" },
            { id: "b", text: "10/π cm" },
            { id: "c", text: "5π cm" },
            { id: "d", text: "10π cm" },
          ],
          correctAnswer: "a",
          subject: "Physics",
          explanation:
            "For SHM, v = ωA cos(ωt). At t = 0 and mean position, v = ωA. ω = 2π/T = 2π/2 = π. So, A = v/ω = 5/π cm.",
        },
        {
          id: 8,
          question:
            "A sound wave of frequency 500 Hz is traveling in air with a speed of 350 m/s. The phase difference between two points separated by a distance of 35 cm along the direction of propagation of the wave is:",
          options: [
            { id: "a", text: "π/5 rad" },
            { id: "b", text: "π/2 rad" },
            { id: "c", text: "π rad" },
            { id: "d", text: "2π rad" },
          ],
          correctAnswer: "a",
          subject: "Physics",
          explanation:
            "Phase difference = (2π/λ) × distance. λ = v/f = 350/500 = 0.7 m. Phase difference = (2π/0.7) × 0.35 = π/5 rad.",
        },
        {
          id: 9,
          question:
            "A ray of light is incident on a glass slab at an angle of 60°. If the refractive index of the glass is √3, the angle of refraction inside the glass is:",
          options: [
            { id: "a", text: "30°" },
            { id: "b", text: "45°" },
            { id: "c", text: "60°" },
            { id: "d", text: "90°" },
          ],
          correctAnswer: "a",
          subject: "Physics",
          explanation:
            "Using Snell's law: sin(i)/sin(r) = n. sin(60°)/sin(r) = √3. sin(r) = sin(60°)/√3 = 0.5. Therefore, r = 30°.",
        },
        {
          id: 10,
          question:
            "An electron and a proton are accelerated through the same potential difference. The ratio of their de Broglie wavelengths (λₑ/λₚ) is:",
          options: [
            { id: "a", text: "1" },
            { id: "b", text: "√(mₚ/mₑ)" },
            { id: "c", text: "mₚ/mₑ" },
            { id: "d", text: "(mₚ/mₑ)²" },
          ],
          correctAnswer: "b",
          subject: "Physics",
          explanation:
            "λ = h/p = h/√(2mK). For the same potential difference, K = qV is the same. So λₑ/λₚ = √(mₚ/mₑ).",
        },
      ],
    },
    chemistry: {
      questions: [
        {
          id: 11,
          question: "The pH of a solution is 4.5. What is the concentration of H⁺ ions in the solution?",
          options: [
            { id: "a", text: "3.16 × 10⁻⁵ M" },
            { id: "b", text: "3.16 × 10⁻⁴ M" },
            { id: "c", text: "3.16 × 10⁻³ M" },
            { id: "d", text: "3.16 × 10⁻² M" },
          ],
          correctAnswer: "b",
          subject: "Chemistry",
          explanation: "pH = -log[H⁺], so [H⁺] = 10⁻ᵖᴴ = 10⁻⁴·⁵ = 3.16 × 10⁻⁴ M.",
        },
        {
          id: 12,
          question: "Which of the following compounds will show geometrical isomerism?",
          options: [
            { id: "a", text: "2-butene" },
            { id: "b", text: "2-butyne" },
            { id: "c", text: "Propene" },
            { id: "d", text: "Propane" },
          ],
          correctAnswer: "a",
          subject: "Chemistry",
          explanation:
            "2-butene (CH₃-CH=CH-CH₃) can exist as cis and trans isomers due to restricted rotation around the C=C double bond.",
        },
        {
          id: 13,
          question: "Which of the following is a strong electrolyte?",
          options: [
            { id: "a", text: "CH₃COOH" },
            { id: "b", text: "NH₄OH" },
            { id: "c", text: "HCl" },
            { id: "d", text: "H₂CO₃" },
          ],
          correctAnswer: "c",
          subject: "Chemistry",
          explanation: "HCl is a strong electrolyte as it completely dissociates in water to form H⁺ and Cl⁻ ions.",
        },
        {
          id: 14,
          question: "The IUPAC name of the compound CH₃-CH=CH-CHO is:",
          options: [
            { id: "a", text: "But-2-enal" },
            { id: "b", text: "But-3-enal" },
            { id: "c", text: "But-2-en-1-al" },
            { id: "d", text: "But-3-en-1-al" },
          ],
          correctAnswer: "a",
          subject: "Chemistry",
          explanation:
            "The compound has a 4-carbon chain with a double bond at position 2 and an aldehyde group. The IUPAC name is but-2-enal.",
        },
        {
          id: 15,
          question: "Which of the following has the highest boiling point?",
          options: [
            { id: "a", text: "CH₃CH₂CH₂CH₃" },
            { id: "b", text: "CH₃CH₂CH₂OH" },
            { id: "c", text: "CH₃CH₂OCH₃" },
            { id: "d", text: "CH₃CH₂CHO" },
          ],
          correctAnswer: "b",
          subject: "Chemistry",
          explanation:
            "CH₃CH₂CH₂OH (propanol) has the highest boiling point due to hydrogen bonding between molecules.",
        },
        {
          id: 16,
          question: "The hybridization of carbon in diamond is:",
          options: [
            { id: "a", text: "sp" },
            { id: "b", text: "sp²" },
            { id: "c", text: "sp³" },
            { id: "d", text: "sp³d" },
          ],
          correctAnswer: "c",
          subject: "Chemistry",
          explanation:
            "In diamond, each carbon atom is bonded to four other carbon atoms in a tetrahedral arrangement, which corresponds to sp³ hybridization.",
        },
        {
          id: 17,
          question: "Which of the following is not a colligative property?",
          options: [
            { id: "a", text: "Elevation in boiling point" },
            { id: "b", text: "Depression in freezing point" },
            { id: "c", text: "Osmotic pressure" },
            { id: "d", text: "Optical activity" },
          ],
          correctAnswer: "d",
          subject: "Chemistry",
          explanation:
            "Optical activity depends on the molecular structure, not on the number of solute particles. The other options are colligative properties.",
        },
        {
          id: 18,
          question: "The oxidation state of chromium in K₂Cr₂O₇ is:",
          options: [
            { id: "a", text: "+3" },
            { id: "b", text: "+4" },
            { id: "c", text: "+6" },
            { id: "d", text: "+7" },
          ],
          correctAnswer: "c",
          subject: "Chemistry",
          image: "/placeholder.svg?height=200&width=300",
          explanation:
            "In K₂Cr₂O₇, let x be the oxidation state of Cr. Then, 2(+1) + 2(x) + 7(-2) = 0. Solving, 2 + 2x - 14 = 0, so x = +6.",
        },
        {
          id: 19,
          question: "Which of the following is an example of a coordination compound?",
          options: [
            { id: "a", text: "NaCl" },
            { id: "b", text: "K₄[Fe(CN)₆]" },
            { id: "c", text: "CaO" },
            { id: "d", text: "CH₄" },
          ],
          correctAnswer: "b",
          subject: "Chemistry",
          explanation:
            "K₄[Fe(CN)₆] is a coordination compound where Fe is the central metal ion and CN⁻ are the ligands.",
        },
        {
          id: 20,
          question: "The number of isomers possible for the compound with molecular formula C₄H₉Cl is:",
          options: [
            { id: "a", text: "2" },
            { id: "b", text: "4" },
            { id: "c", text: "5" },
            { id: "d", text: "6" },
          ],
          correctAnswer: "b",
          subject: "Chemistry",
          explanation:
            "C₄H₉Cl can form 4 isomers: 1-chlorobutane, 2-chlorobutane, 1-chloro-2-methylpropane, and 2-chloro-2-methylpropane.",
        },
      ],
    },
    mathematics: {
      questions: [
        {
          id: 21,
          question: "If f(x) = x² - 3x + 2 and g(x) = 2x + 1, find (f ∘ g)(x).",
          options: [
            { id: "a", text: "4x² + 4x + 3" },
            { id: "b", text: "4x² + 4x - 3" },
            { id: "c", text: "4x² - 4x + 3" },
            { id: "d", text: "4x² - 4x - 3" },
          ],
          correctAnswer: "a",
          subject: "Mathematics",
          explanation:
            "(f ∘ g)(x) = f(g(x)) = f(2x + 1) = (2x + 1)² - 3(2x + 1) + 2 = 4x² + 4x + 1 - 6x - 3 + 2 = 4x² - 2x + 0 = 4x² - 2x",
        },
        {
          id: 22,
          question: "The value of ∫(1/x) dx from 1 to e is:",
          options: [
            { id: "a", text: "1" },
            { id: "b", text: "e" },
            { id: "c", text: "ln(e)" },
            { id: "d", text: "e - 1" },
          ],
          correctAnswer: "a",
          subject: "Mathematics",
          explanation: "∫(1/x) dx = ln|x|. So, ∫(1/x) dx from 1 to e = ln(e) - ln(1) = 1 - 0 = 1.",
        },
        {
          id: 23,
          question: "If the roots of the equation x² + px + q = 0 are in the ratio 1:4, then p² : q is equal to:",
          options: [
            { id: "a", text: "25 : 16" },
            { id: "b", text: "25 : 4" },
            { id: "c", text: "5 : 2" },
            { id: "d", text: "5 : 4" },
          ],
          correctAnswer: "a",
          subject: "Mathematics",
          explanation:
            "If the roots are α and 4α, then α + 4α = -p and α × 4α = q. So, 5α = -p and 4α² = q. Therefore, p² = 25α² and q = 4α². So, p² : q = 25α² : 4α² = 25 : 4.",
        },
        {
          id: 24,
          question: "The derivative of tan(x) with respect to x is:",
          options: [
            { id: "a", text: "sec(x)" },
            { id: "b", text: "sec²(x)" },
            { id: "c", text: "tan²(x)" },
            { id: "d", text: "sec(x)tan(x)" },
          ],
          correctAnswer: "b",
          subject: "Mathematics",
          explanation: "The derivative of tan(x) with respect to x is sec²(x).",
        },
        {
          id: 25,
          question: "If A and B are two events such that P(A) = 0.4, P(B) = 0.3, and P(A ∩ B) = 0.2, then P(A | B) is:",
          options: [
            { id: "a", text: "0.5" },
            { id: "b", text: "0.6" },
            { id: "c", text: "2/3" },
            { id: "d", text: "3/4" },
          ],
          correctAnswer: "c",
          subject: "Mathematics",
          explanation: "P(A | B) = P(A ∩ B) / P(B) = 0.2 / 0.3 = 2/3.",
        },
        {
          id: 26,
          question: "The sum of the series 1 + 3 + 5 + ... + 99 is:",
          options: [
            { id: "a", text: "2500" },
            { id: "b", text: "2550" },
            { id: "c", text: "2600" },
            { id: "d", text: "2650" },
          ],
          correctAnswer: "b",
          subject: "Mathematics",
          image: "/placeholder.svg?height=200&width=300",
          explanation:
            "This is an arithmetic progression with a = 1, d = 2, and l = 99. The number of terms n = (l - a) / d + 1 = (99 - 1) / 2 + 1 = 50. The sum is n/2 × (a + l) = 50/2 × (1 + 99) = 25 × 100 = 2500.",
        },
        {
          id: 27,
          question: "The value of sin(30°) × cos(60°) + cos(30°) × sin(60°) is:",
          options: [
            { id: "a", text: "0" },
            { id: "b", text: "1/2" },
            { id: "c", text: "1" },
            { id: "d", text: "√3/2" },
          ],
          correctAnswer: "c",
          subject: "Mathematics",
          explanation:
            "Using the formula sin(A + B) = sin(A)cos(B) + cos(A)sin(B), we get sin(30° + 60°) = sin(90°) = 1.",
        },
        {
          id: 28,
          question: "The equation of the line passing through the points (1, 2) and (3, 4) is:",
          options: [
            { id: "a", text: "y = x + 1" },
            { id: "b", text: "y = 2x" },
            { id: "c", text: "y = x + 1" },
            { id: "d", text: "y = 2x - 1" },
          ],
          correctAnswer: "a",
          subject: "Mathematics",
          explanation:
            "The slope of the line is (4 - 2) / (3 - 1) = 2 / 2 = 1. Using the point-slope form: y - 2 = 1 × (x - 1), we get y - 2 = x - 1, or y = x + 1.",
        },
        {
          id: 29,
          question: "The value of lim(x→0) (sin(x) / x) is:",
          options: [
            { id: "a", text: "0" },
            { id: "b", text: "1" },
            { id: "c", text: "∞" },
            { id: "d", text: "Does not exist" },
          ],
          correctAnswer: "b",
          subject: "Mathematics",
          explanation: "The limit of sin(x) / x as x approaches 0 is 1, which is a well-known result in calculus.",
        },
        {
          id: 30,
          question:
            "If the vectors a = 2i + 3j and b = i - j are perpendicular to vector c = xi + yj, then the values of x and y satisfy:",
          options: [
            { id: "a", text: "2x + 3y = 0 and x - y = 0" },
            { id: "b", text: "2x - 3y = 0 and x + y = 0" },
            { id: "c", text: "2x + 3y = 0 and x - y = 0" },
            { id: "d", text: "2x - 3y = 0 and x - y = 0" },
          ],
          correctAnswer: "c",
          subject: "Mathematics",
          explanation:
            "For perpendicularity, the dot product must be zero. a · c = 0 gives 2x + 3y = 0, and b · c = 0 gives x - y = 0.",
        },
      ],
    },
  },
}

const neetData: ExamData = {
  id: "neet",
  name: "NEET",
  fullName: "National Eligibility cum Entrance Test",
  description:
    "NEET is the qualifying entrance exam for MBBS and BDS programmes in Indian medical and dental colleges. It is conducted by the National Testing Agency (NTA).",
  duration: "3 hours 20 minutes",
  markingScheme: {
    correct: 4,
    incorrect: 1,
  },
  sections: {
    physics: {
      questions: [
        {
          id: 1,
          question:
            "A particle moves in a straight line with constant acceleration. If the velocity of the particle is 10 m/s at t = 0 and 20 m/s at t = 2 s, what is the velocity at t = 5 s?",
          options: [
            { id: "a", text: "25 m/s" },
            { id: "b", text: "30 m/s" },
            { id: "c", text: "35 m/s" },
            { id: "d", text: "40 m/s" },
          ],
          correctAnswer: "c",
          subject: "Physics",
          explanation:
            "The acceleration is (20 - 10)/2 = 5 m/s². Using v = u + at, at t = 5s, v = 10 + 5 × 5 = 35 m/s.",
        },
        {
          id: 2,
          question:
            "A body of mass 2 kg is thrown upwards with a velocity of 20 m/s. What is the kinetic energy at the highest point? (g = 10 m/s²)",
          options: [
            { id: "a", text: "0 J" },
            { id: "b", text: "200 J" },
            { id: "c", text: "400 J" },
            { id: "d", text: "800 J" },
          ],
          correctAnswer: "a",
          subject: "Physics",
          explanation: "At the highest point, the velocity becomes zero. Hence, the kinetic energy is zero.",
        },
        // Add more physics questions for NEET
      ],
    },
    chemistry: {
      questions: [
        {
          id: 11,
          question: "The pH of a solution is 4.5. What is the concentration of H⁺ ions in the solution?",
          options: [
            { id: "a", text: "3.16 × 10⁻⁵ M" },
            { id: "b", text: "3.16 × 10⁻⁴ M" },
            { id: "c", text: "3.16 × 10⁻³ M" },
            { id: "d", text: "3.16 × 10⁻² M" },
          ],
          correctAnswer: "b",
          subject: "Chemistry",
          explanation: "pH = -log[H⁺], so [H⁺] = 10⁻ᵖᴴ = 10⁻⁴·⁵ = 3.16 × 10⁻⁴ M.",
        },
        // Add more chemistry questions for NEET
      ],
    },
    mathematics: {
      questions: [
        {
          id: 21,
          question: "The structure that helps in attachment of the leg muscles in cockroach is:",
          options: [
            { id: "a", text: "Coxa" },
            { id: "b", text: "Trochanter" },
            { id: "c", text: "Apodeme" },
            { id: "d", text: "Femur" },
          ],
          correctAnswer: "c",
          subject: "Biology",
          explanation: "Apodemes are the structures that help in the attachment of leg muscles in cockroach.",
        },
        // Add more biology questions for NEET (using mathematics section as a placeholder)
      ],
    },
  },
}

const eamcetAPData: ExamData = {
  id: "eamcet-ap",
  name: "EAMCET (AP)",
  fullName: "Engineering, Agriculture and Medical Common Entrance Test (Andhra Pradesh)",
  description:
    "AP EAMCET is a state-level entrance examination conducted for admission to various professional courses offered in university/private colleges in the state of Andhra Pradesh.",
  duration: "3 hours",
  markingScheme: {
    correct: 1,
    incorrect: 0,
  },
  sections: {
    physics: {
      questions: [
        {
          id: 1,
          question:
            "A particle moves in a straight line with constant acceleration. If the velocity of the particle is 10 m/s at t = 0 and 20 m/s at t = 2 s, what is the velocity at t = 5 s?",
          options: [
            { id: "a", text: "25 m/s" },
            { id: "b", text: "30 m/s" },
            { id: "c", text: "35 m/s" },
            { id: "d", text: "40 m/s" },
          ],
          correctAnswer: "c",
          subject: "Physics",
          explanation:
            "The acceleration is (20 - 10)/2 = 5 m/s². Using v = u + at, at t = 5s, v = 10 + 5 × 5 = 35 m/s.",
        },
        // Add more physics questions for EAMCET
      ],
    },
    chemistry: {
      questions: [
        {
          id: 11,
          question: "The pH of a solution is 4.5. What is the concentration of H⁺ ions in the solution?",
          options: [
            { id: "a", text: "3.16 × 10⁻⁵ M" },
            { id: "b", text: "3.16 × 10⁻⁴ M" },
            { id: "c", text: "3.16 × 10⁻³ M" },
            { id: "d", text: "3.16 × 10⁻² M" },
          ],
          correctAnswer: "b",
          subject: "Chemistry",
          explanation: "pH = -log[H⁺], so [H⁺] = 10⁻ᵖᴴ = 10⁻⁴·⁵ = 3.16 × 10⁻⁴ M.",
        },
        // Add more chemistry questions for EAMCET
      ],
    },
    mathematics: {
      questions: [
        {
          id: 21,
          question: "If f(x) = x² - 3x + 2 and g(x) = 2x + 1, find (f ∘ g)(x).",
          options: [
            { id: "a", text: "4x² + 4x + 3" },
            { id: "b", text: "4x² + 4x - 3" },
            { id: "c", text: "4x² - 4x + 3" },
            { id: "d", text: "4x² - 4x - 3" },
          ],
          correctAnswer: "a",
          subject: "Mathematics",
          explanation:
            "(f ∘ g)(x) = f(g(x)) = f(2x + 1) = (2x + 1)² - 3(2x + 1) + 2 = 4x² + 4x + 1 - 6x - 3 + 2 = 4x² - 2x + 0 = 4x² - 2x",
        },
        // Add more mathematics questions for EAMCET
      ],
    },
  },
}

// Function to get exam data based on exam ID
export function getExamData(examId: string): ExamData {
  switch (examId) {
    case "jee-main":
      return jeeMainData
    case "neet":
      return neetData
    case "eamcet-ap":
      return eamcetAPData
    default:
      return jeeMainData // Default to JEE Main if exam ID is not found
  }
}
