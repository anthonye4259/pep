import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoFlaskOutline, IoChevronForward } from 'react-icons/io5';

const peptideLibrary = [
  { name: 'BPC-157', category: 'Recovery', desc: 'Body Protection Compound. Studied for gut healing, tissue repair, and injury recovery.', defaultMg: 5, defaultMcg: 250 },
  { name: 'TB-500', category: 'Recovery', desc: 'Thymosin Beta-4 fragment. Studied for wound healing, flexibility, and inflammation.', defaultMg: 5, defaultMcg: 2500 },
  { name: 'Semaglutide', category: 'Metabolic', desc: 'GLP-1 receptor agonist. Used for weight management and blood sugar regulation.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Tirzepatide', category: 'Metabolic', desc: 'Dual GIP/GLP-1 agonist. Used for weight loss and metabolic health.', defaultMg: 10, defaultMcg: 2500 },
  { name: 'CJC-1295', category: 'Growth Hormone', desc: 'Growth hormone releasing hormone analog. Often paired with Ipamorelin.', defaultMg: 5, defaultMcg: 100 },
  { name: 'Ipamorelin', category: 'Growth Hormone', desc: 'Selective growth hormone secretagogue. Clean GH pulse with minimal side effects.', defaultMg: 5, defaultMcg: 200 },
  { name: 'MK-677', category: 'Growth Hormone', desc: 'Oral growth hormone secretagogue (Ibutamoren). Increases IGF-1 and GH levels.', defaultMg: 25, defaultMcg: 25000 },
  { name: 'GHK-Cu', category: 'Anti-Aging', desc: 'Copper peptide. Studied for skin rejuvenation, hair growth, and collagen synthesis.', defaultMg: 50, defaultMcg: 200 },
  { name: 'Epithalon', category: 'Anti-Aging', desc: 'Telomerase activator. Studied for anti-aging and cellular longevity.', defaultMg: 10, defaultMcg: 5000 },
  { name: 'PT-141', category: 'Other', desc: 'Bremelanotide. Melanocortin receptor agonist studied for sexual dysfunction.', defaultMg: 10, defaultMcg: 1750 },
  { name: 'Thymosin Alpha-1', category: 'Immune', desc: 'Immune modulator. Studied for immune system enhancement and viral infections.', defaultMg: 5, defaultMcg: 1600 },
  { name: 'SS-31', category: 'Anti-Aging', desc: 'Elamipretide. Mitochondrial-targeted peptide studied for cellular energy.', defaultMg: 5, defaultMcg: 500 },
  { name: 'Selank', category: 'Other', desc: 'Anxiolytic peptide. Studied for anxiety reduction and cognitive enhancement.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Semax', category: 'Other', desc: 'Nootropic peptide. Studied for cognitive function and neuroprotection.', defaultMg: 5, defaultMcg: 200 },
  { name: 'DSIP', category: 'Other', desc: 'Delta sleep-inducing peptide. Studied for sleep regulation and stress reduction.', defaultMg: 5, defaultMcg: 100 },
  { name: 'AOD-9604', category: 'Metabolic', desc: 'Growth hormone fragment. Studied for fat metabolism and weight management.', defaultMg: 5, defaultMcg: 300 },
];

const categories = ['All', ...new Set(peptideLibrary.map(p => p.category))];

export default function Library() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = peptideLibrary.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  function handleSelect(peptide) {
    navigate('/guide', {
      state: {
        peptideName: peptide.name,
        peptideMg: peptide.defaultMg,
        targetMcg: peptide.defaultMcg,
        waterMl: '',
      }
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Library</h1>
        <p>{peptideLibrary.length} peptides</p>
      </div>

      <div className="search-bar">
        <IoSearch className="search-icon" size={18} />
        <input type="text" className="input" placeholder="Search peptides..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="category-filter">
        {categories.map(c => (
          <button key={c} className={`category-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {filtered.map((p, i) => (
        <button key={i} className="peptide-card" onClick={() => handleSelect(p)} style={{ width: '100%', textAlign: 'left', border: 'none' }}>
          <div className="peptide-icon"><IoFlaskOutline size={20} /></div>
          <div className="peptide-info">
            <div className="peptide-name">{p.name}</div>
            <div className="peptide-cat">{p.category}</div>
            <div className="peptide-desc">{p.desc}</div>
          </div>
          <IoChevronForward size={16} color="#999" />
        </button>
      ))}
    </div>
  );
}
