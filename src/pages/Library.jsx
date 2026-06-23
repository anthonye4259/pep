import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearch, IoBookOutline, IoChevronForward, IoFlaskOutline, IoMedkitOutline, IoArrowBack } from 'react-icons/io5';

const educationalTopics = [
  { 
    title: 'What Are Peptides?', category: 'Basics', 
    desc: 'Short chains of amino acids that serve as building blocks for proteins.',
    content: `Peptides are short chains of amino acids, typically consisting of 2 to 50 amino acids linked by peptide bonds. They are essentially smaller versions of proteins.\n\n**Key Points:**\n\n• **Structure**: Peptides are formed when amino acids connect through peptide bonds — a chemical bond formed between the carboxyl group of one amino acid and the amino group of another.\n\n• **Types**: Peptides are classified by size — dipeptides (2 amino acids), tripeptides (3), oligopeptides (up to ~20), and polypeptides (20+).\n\n• **Natural Occurrence**: Your body naturally produces many peptides. Insulin, for example, is a peptide hormone consisting of 51 amino acids.\n\n• **Research Applications**: Peptides are widely studied in research for their potential roles in cellular signaling, immune function, and tissue repair.\n\n• **Peptides vs. Proteins**: The main difference is size. Peptides generally contain fewer than 50 amino acids, while proteins are larger, more complex structures.`
  },
  { 
    title: 'Understanding Amino Acids', category: 'Basics', 
    desc: 'The fundamental units of peptides and proteins.',
    content: `Amino acids are organic molecules that serve as the building blocks of peptides and proteins. There are 20 standard amino acids used by the body.\n\n**Essential Amino Acids** (must be obtained from diet):\n• Leucine, Isoleucine, Valine (BCAAs)\n• Lysine, Methionine, Phenylalanine\n• Threonine, Tryptophan, Histidine\n\n**Non-Essential Amino Acids** (body can produce):\n• Alanine, Asparagine, Aspartic acid\n• Glutamic acid, Serine\n\n**Conditionally Essential** (needed during stress/illness):\n• Arginine, Glutamine, Tyrosine\n• Cysteine, Glycine, Proline\n\n**Why It Matters**: The sequence and combination of amino acids determines the peptide's structure and function. Even a single amino acid change can dramatically alter biological activity.`
  },
  { 
    title: 'Peptide Bonds Explained', category: 'Basics', 
    desc: 'How amino acids link together to form chains and structures.',
    content: `A peptide bond is a covalent chemical bond formed between two amino acids through a condensation reaction (also called dehydration synthesis).\n\n**How It Works**:\n1. The carboxyl group (-COOH) of one amino acid reacts with the amino group (-NH₂) of another\n2. A water molecule (H₂O) is released\n3. A C-N bond forms, linking the two amino acids\n\n**Properties**:\n• Peptide bonds are **planar** — the atoms around the bond exist in a flat plane\n• They have **partial double-bond character**, making them rigid\n• They are **resistant to hydrolysis** under normal physiological conditions\n• Enzymes called **proteases** can break peptide bonds\n\n**Stability**: Peptide bonds are quite stable, which is why peptides must be stored properly — once they degrade, the bonds break and the peptide loses its function.`
  },
  { 
    title: 'Lyophilization', category: 'Lab Science', 
    desc: 'The freeze-drying process used to preserve biological materials.',
    content: `Lyophilization (freeze-drying) is a dehydration process used to preserve peptides and other biological materials.\n\n**The Process**:\n1. **Freezing**: The solution is frozen at very low temperatures (-40°C to -80°C)\n2. **Primary Drying**: Pressure is reduced and heat is applied — ice sublimates directly to vapor (no liquid phase)\n3. **Secondary Drying**: Remaining moisture is removed, typically reaching <1% water content\n\n**Why Lyophilize Peptides?**\n• Dramatically extends shelf life (months → years)\n• Removes water that could cause degradation\n• Creates a stable powder form for storage and shipping\n• Easier to measure precise quantities\n\n**Reconstitution**: When ready for research use, the lyophilized powder is reconstituted by adding bacteriostatic water or sterile water. The powder dissolves to recreate the original solution.\n\n**Storage**: Lyophilized peptides should be stored at -20°C for long-term storage. Once reconstituted, refrigerate at 2-8°C.`
  },
  { 
    title: 'Bacteriostatic Water', category: 'Lab Science', 
    desc: 'Sterile water containing 0.9% benzyl alcohol for reconstitution.',
    content: `Bacteriostatic water (BAC water) is sterile water that contains 0.9% benzyl alcohol as a preservative.\n\n**Key Properties**:\n• **Sterile**: Manufactured under aseptic conditions\n• **Antimicrobial**: Benzyl alcohol inhibits bacterial growth\n• **Multi-use**: Unlike sterile water, can be used multiple times (up to 28 days after opening)\n• **pH**: Typically 4.5-7.0\n\n**BAC Water vs. Sterile Water**:\n| Feature | BAC Water | Sterile Water |\n|---------|-----------|---------------|\n| Preservative | Yes (benzyl alcohol) | No |\n| Multi-use | Yes (28 days) | Single use only |\n| Shelf life after opening | 28 days | Use immediately |\n| Best for | Multiple-dose research | Single-dose use |\n\n**Important Notes**:\n• Always use a new sterile needle when drawing from the vial\n• Store at room temperature (15-30°C)\n• Discard 28 days after first puncture\n• Never use if solution appears cloudy or contains particles`
  },
  { 
    title: 'Concentration Basics', category: 'Lab Science', 
    desc: 'Understanding mg, mcg, and mL — how to calculate concentrations.',
    content: `Understanding concentrations is essential for accurate research work.\n\n**Units of Measurement**:\n• **mg** (milligram) = 1/1000 of a gram\n• **mcg** or **μg** (microgram) = 1/1000 of a milligram = 1/1,000,000 of a gram\n• **mL** (milliliter) = 1/1000 of a liter\n• **IU** (International Unit) = a standardized unit of biological activity\n\n**Concentration Formula**:\n\`Concentration = Amount of peptide (mg) ÷ Volume of solvent (mL)\`\n\n**Example Calculation**:\n• You have a 5mg vial of peptide\n• You add 2mL of BAC water\n• Concentration = 5mg ÷ 2mL = **2.5 mg/mL** (or 2,500 mcg/mL)\n\n**Desired Dose Calculation**:\n• If you need 250mcg and your concentration is 2,500 mcg/mL:\n• Volume needed = 250 ÷ 2,500 = **0.1 mL** = **10 units** on a U-100 syringe\n\n**Pro Tip**: Use the PeptidAI reconstitution calculator for automatic calculations — enter your vial size and BAC water amount, and it does the math for you.`
  },
  { 
    title: 'Lab Safety', category: 'Safety', 
    desc: 'Best practices for handling research materials safely.',
    content: `Proper lab safety protects both the researcher and the integrity of research materials.\n\n**Sterile Technique Essentials**:\n1. **Clean workspace**: Wipe surfaces with 70% isopropyl alcohol\n2. **Hand hygiene**: Wash hands thoroughly before handling materials\n3. **Alcohol swabs**: Always swab vial tops and injection sites\n4. **New needles**: Never reuse needles or syringes\n5. **Sharps disposal**: Use a proper sharps container\n\n**Material Handling**:\n• Work in a clean, well-lit area\n• Avoid touching needle tips or vial openings\n• Draw BAC water into syringe before inserting into peptide vial\n• Add water slowly — don't shake the vial (gentle swirl instead)\n\n**Storage Safety**:\n• Keep materials out of reach of children and pets\n• Label everything clearly with contents and date\n• Maintain proper temperature storage\n\n**Emergency**: If you experience any adverse reaction during research, seek medical attention immediately. Keep a first aid kit accessible in your workspace.`
  },
  { 
    title: 'Proper Storage', category: 'Safety', 
    desc: 'Temperature and light requirements for preservation.',
    content: `Proper storage is critical for maintaining peptide stability and potency.\n\n**Unreconstituted (Lyophilized Powder)**:\n• **Ideal**: -20°C (freezer) for long-term storage\n• **Acceptable**: 2-8°C (refrigerator) for short-term\n• **Shelf life**: Up to 2 years when stored properly at -20°C\n\n**Reconstituted (In Solution)**:\n• **Required**: 2-8°C (refrigerator)\n• **Shelf life**: Typically 3-4 weeks\n• **Never freeze** reconstituted solutions\n\n**Environmental Factors**:\n• 🌡️ **Temperature**: Most critical factor. Heat degrades peptides rapidly\n• ☀️ **Light**: UV light breaks peptide bonds. Store in amber vials or dark locations\n• 💧 **Moisture**: Lyophilized peptides absorb moisture. Keep sealed\n• 🫧 **Agitation**: Don't shake — mechanical stress can denature peptides\n\n**Travel Tips**:\n• Use insulated containers with ice packs\n• Keep out of direct sunlight\n• Minimize time at room temperature\n• For flights, pack in carry-on (cargo hold temperature varies)`
  },
  { 
    title: 'Understanding Half-Lives', category: 'Science', 
    desc: 'Biological half-life and why it matters in research.',
    content: `Half-life is the time it takes for the concentration of a substance to reduce by half in the body.\n\n**Types of Half-Life**:\n• **Biological half-life**: Time for the body to eliminate half of the substance\n• **Terminal half-life**: Time for blood concentration to halve after distribution\n• **Effective half-life**: Accounts for both biological elimination and decay\n\n**Why It Matters**:\nHalf-life determines:\n1. **Dosing frequency** — shorter half-life = more frequent dosing\n2. **Steady state** — reached after ~5 half-lives of regular dosing\n3. **Washout period** — substance is effectively eliminated after ~5 half-lives\n\n**Examples**:\n• Very short: Some peptides have half-lives of just 2-5 minutes\n• Short: GH-releasing peptides: ~15-30 minutes\n• Moderate: Modified peptides: 2-6 hours\n• Long: PEGylated peptides: days to weeks\n\n**Modifications**: Scientists extend peptide half-lives through:\n• PEGylation (adding polyethylene glycol)\n• Lipidation (attaching fatty acid chains)\n• D-amino acid substitution\n• Cyclization`
  },
  { 
    title: 'Sleep & Recovery Science', category: 'Wellness', 
    desc: 'How sleep quality affects cellular repair and hormone regulation.',
    content: `Sleep is one of the most powerful recovery tools available, directly affecting peptide-related processes.\n\n**Sleep Stages & Recovery**:\n• **Stage 1-2** (Light sleep): Body temperature drops, heart rate slows\n• **Stage 3** (Deep/SWS sleep): Peak growth hormone release, tissue repair, immune function\n• **REM sleep**: Brain recovery, memory consolidation, emotional processing\n\n**Growth Hormone & Sleep**:\n• 70% of daily GH is released during deep sleep\n• Peak GH release occurs in the first 90 minutes of sleep\n• Poor sleep can reduce GH output by up to 75%\n\n**Optimization Tips**:\n1. **Consistent schedule**: Same bed/wake time daily (±30 min)\n2. **Cool room**: 65-68°F (18-20°C) is optimal\n3. **Dark environment**: Block all light sources\n4. **No screens**: Blue light suppresses melatonin — stop 1hr before bed\n5. **Magnesium**: Consider glycinate form for sleep quality\n6. **Caffeine cutoff**: No caffeine after 2pm\n7. **Exercise timing**: Finish intense exercise 3+ hours before bed`
  },
  { 
    title: 'Metabolic Health', category: 'Wellness', 
    desc: 'Understanding metabolism and energy balance.',
    content: `Metabolic health encompasses how efficiently your body converts food into energy and manages blood sugar, lipids, and inflammation.\n\n**Key Metabolic Markers**:\n• **Fasting glucose**: Ideally < 100 mg/dL\n• **HbA1c**: < 5.7% (3-month blood sugar average)\n• **Triglycerides**: < 150 mg/dL\n• **HDL cholesterol**: > 40 mg/dL (men), > 50 mg/dL (women)\n• **Waist circumference**: < 40\" (men), < 35\" (women)\n• **Blood pressure**: < 120/80 mmHg\n\n**Metabolic Rate Factors**:\n• **BMR** (Basal Metabolic Rate): Calories burned at rest (~60-75% of total)\n• **TEF** (Thermic Effect of Food): Energy used to digest (~10%)\n• **NEAT** (Non-Exercise Activity): Fidgeting, walking, standing (~15-30%)\n• **EAT** (Exercise Activity): Intentional exercise (~5-10%)\n\n**Optimization Strategies**:\n1. Build and maintain lean muscle mass\n2. Prioritize protein (increases TEF)\n3. Walk 8,000-10,000 steps daily (boosts NEAT)\n4. Manage stress (cortisol impairs metabolic health)\n5. Get adequate sleep (see Sleep & Recovery)`
  },
  { 
    title: 'Immune System Basics', category: 'Wellness', 
    desc: 'How the immune system works and the role of peptides.',
    content: `The immune system is a complex network of cells, tissues, and organs that defends against harmful invaders.\n\n**Two Main Branches**:\n\n**Innate Immunity** (first line of defense):\n• Physical barriers: skin, mucous membranes\n• Cellular: neutrophils, macrophages, NK cells\n• Chemical: complement system, antimicrobial peptides\n• Response: Fast (minutes to hours), non-specific\n\n**Adaptive Immunity** (targeted defense):\n• B cells: Produce antibodies\n• T cells: Kill infected cells, coordinate response\n• Memory cells: Remember past infections\n• Response: Slower (days to weeks), highly specific\n\n**Peptides & Immunity**:\n• **Antimicrobial peptides (AMPs)**: Naturally produced peptides that kill bacteria, viruses, and fungi\n• **Thymosin**: Peptide hormones from the thymus that regulate T-cell development\n• **Thymalin**: Research peptide studied for immune modulation\n\n**Supporting Immune Health**:\n1. Sleep 7-9 hours nightly\n2. Manage stress (chronic stress suppresses immunity)\n3. Regular moderate exercise\n4. Adequate vitamin D, zinc, and vitamin C\n5. Minimize alcohol consumption`
  },
];

const categories = ['All', ...new Set(educationalTopics.map(p => p.category))];

export default function Library() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const navigate = useNavigate();

  const filtered = educationalTopics.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  // Topic detail view
  if (selectedTopic) {
    return (
      <div className="page" style={{ animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button 
            onClick={() => setSelectedTopic(null)} 
            style={{ background: 'var(--bg-card)', border: 'none', borderRadius: 'var(--radius-xs)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedTopic.category}</span>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{selectedTopic.title}</h2>
          </div>
        </div>

        <div style={{ 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius)', 
          padding: 24,
          lineHeight: 1.7,
          fontSize: '0.95rem',
          color: 'var(--text)',
        }}>
          {selectedTopic.content.split('\n\n').map((paragraph, i) => {
            // Handle bold headers
            if (paragraph.startsWith('**') && paragraph.endsWith('**:')) {
              return <h3 key={i} style={{ fontSize: '1.1rem', marginTop: i > 0 ? 20 : 0, marginBottom: 8 }}>{paragraph.replace(/\*\*/g, '')}</h3>;
            }
            // Handle headers with content
            if (paragraph.startsWith('**')) {
              const parts = paragraph.split('**');
              return (
                <div key={i} style={{ marginTop: i > 0 ? 16 : 0 }}>
                  {parts.map((part, j) => 
                    j % 2 === 1 
                      ? <strong key={j}>{part}</strong> 
                      : <span key={j}>{part.split('\n').map((line, k) => {
                          if (line.startsWith('• ')) return <div key={k} style={{ paddingLeft: 12, marginTop: 4, color: 'var(--text-secondary)' }}>• {line.slice(2)}</div>;
                          if (line.match(/^\d+\./)) return <div key={k} style={{ paddingLeft: 12, marginTop: 4, color: 'var(--text-secondary)' }}>{line}</div>;
                          return <span key={k}>{line}</span>;
                        })}</span>
                  )}
                </div>
              );
            }
            // Handle bullet lists
            if (paragraph.includes('\n•')) {
              const lines = paragraph.split('\n');
              return (
                <div key={i} style={{ marginTop: i > 0 ? 12 : 0 }}>
                  {lines.map((line, j) => {
                    if (line.startsWith('• ')) return <div key={j} style={{ paddingLeft: 12, marginTop: 4, color: 'var(--text-secondary)' }}>• {line.slice(2)}</div>;
                    return <p key={j} style={{ margin: 0 }}>{line}</p>;
                  })}
                </div>
              );
            }
            // Handle code blocks
            if (paragraph.includes('`')) {
              return (
                <p key={i} style={{ marginTop: i > 0 ? 12 : 0 }}>
                  {paragraph.split('`').map((part, j) => 
                    j % 2 === 1 
                      ? <code key={j} style={{ background: 'var(--bg-card-hover)', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem', fontFamily: 'monospace' }}>{part}</code>
                      : <span key={j}>{part}</span>
                  )}
                </p>
              );
            }
            // Handle numbered lists
            if (paragraph.match(/\n\d+\./)) {
              const lines = paragraph.split('\n');
              return (
                <div key={i} style={{ marginTop: i > 0 ? 12 : 0 }}>
                  {lines.map((line, j) => {
                    if (line.match(/^\d+\./)) return <div key={j} style={{ paddingLeft: 12, marginTop: 4, color: 'var(--text-secondary)' }}>{line}</div>;
                    return <p key={j} style={{ margin: 0 }}>{line}</p>;
                  })}
                </div>
              );
            }
            // Regular paragraph
            return <p key={i} style={{ marginTop: i > 0 ? 12 : 0, margin: i > 0 ? '12px 0 0' : 0 }}>{paragraph}</p>;
          })}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="page">
      <div className="page-header">
        <h1>Knowledge Base</h1>
        <p>Learn the fundamentals</p>
      </div>

      <div className="search-bar">
        <IoSearch className="search-icon" size={18} />
        <input type="text" className="input" placeholder="Search topics..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="category-filter">
        {categories.map(c => (
          <button key={c} className={`category-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {filtered.map((p, i) => (
        <div 
          key={i} 
          className="peptide-card" 
          style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setSelectedTopic(p)}
        >
          <div className="peptide-icon"><IoBookOutline size={20} /></div>
          <div className="peptide-info" style={{ flex: 1 }}>
            <div className="peptide-name">{p.title}</div>
            <div className="peptide-cat">{p.category}</div>
            <div className="peptide-desc">{p.desc}</div>
          </div>
          <IoChevronForward size={16} color="var(--text-muted)" />
        </div>
      ))}

      {/* Practical Guides */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>Practical Guides</h2>
        <Link to="/reconstitution-guide" className="peptide-card" style={{ width: '100%', textAlign: 'left', border: 'none', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="peptide-icon"><IoFlaskOutline size={20} /></div>
          <div className="peptide-info" style={{ flex: 1 }}>
            <div className="peptide-name">Reconstitution Guide</div>
            <div className="peptide-desc">Step-by-step reconstitution walkthrough</div>
          </div>
          <IoChevronForward size={16} color="var(--text-muted)" />
        </Link>
        <Link to="/syringe-guide" className="peptide-card" style={{ width: '100%', textAlign: 'left', border: 'none', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="peptide-icon"><IoMedkitOutline size={20} /></div>
          <div className="peptide-info" style={{ flex: 1 }}>
            <div className="peptide-name">Syringe Guide</div>
            <div className="peptide-desc">Reading and measuring with insulin syringes</div>
          </div>
          <IoChevronForward size={16} color="var(--text-muted)" />
        </Link>
      </div>
    </div>
  );
}
