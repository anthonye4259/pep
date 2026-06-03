import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoFlaskOutline, IoChevronForward } from 'react-icons/io5';

const peptideLibrary = [
  { name: 'BPC-157', category: 'Recovery', desc: 'Recovery-focused research peptide. Commonly studied for tissue repair applications.', defaultMg: 5, defaultMcg: 250 },
  { name: 'TB-500', category: 'Recovery', desc: 'Thymosin Beta-4 fragment. Studied for flexibility and repair in research settings.', defaultMg: 5, defaultMcg: 2500 },
  { name: 'Semaglutide', category: 'Metabolic', desc: 'GLP-1 receptor agonist. Studied for metabolic research applications.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Tirzepatide', category: 'Metabolic', desc: 'Dual GIP/GLP-1 receptor agonist. Studied for metabolic pathway research.', defaultMg: 10, defaultMcg: 2500 },
  { name: 'CJC-1295', category: 'Growth Hormone', desc: 'GHRH analog. Commonly paired with Ipamorelin in research stacks.', defaultMg: 5, defaultMcg: 100 },
  { name: 'Ipamorelin', category: 'Growth Hormone', desc: 'Selective GH secretagogue. Studied for GH pulse research applications.', defaultMg: 5, defaultMcg: 200 },
  { name: 'MK-677', category: 'Growth Hormone', desc: 'Oral GH secretagogue. Studied for IGF-1 and GH research.', defaultMg: 25, defaultMcg: 25000 },
  { name: 'GHK-Cu', category: 'Anti-Aging', desc: 'Copper peptide complex. Studied for skin and collagen synthesis research.', defaultMg: 50, defaultMcg: 200 },
  { name: 'Epitalon', category: 'Anti-Aging', desc: 'Telomerase activator. Studied for cellular longevity research.', defaultMg: 10, defaultMcg: 5000 },
  { name: 'Melanotan II', category: 'Other', desc: 'Melanocortin receptor agonist. Studied in various research applications.', defaultMg: 10, defaultMcg: 1750 },
  { name: 'Thymosin Alpha-1', category: 'Immune', desc: 'Immune modulator peptide. Studied for immune system research.', defaultMg: 5, defaultMcg: 1600 },
  { name: 'SS-31', category: 'Anti-Aging', desc: 'Mitochondrial-targeted peptide. Studied for cellular energy research.', defaultMg: 5, defaultMcg: 500 },
  { name: 'Selank', category: 'Other', desc: 'Anxiolytic peptide. Studied for cognitive enhancement research.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Semax', category: 'Other', desc: 'Nootropic peptide. Studied for cognitive function research.', defaultMg: 5, defaultMcg: 200 },
  { name: 'DSIP', category: 'Other', desc: 'Delta sleep-inducing peptide. Studied for sleep pattern research.', defaultMg: 5, defaultMcg: 100 },
  { name: 'AOD-9604', category: 'Metabolic', desc: 'GH fragment 176-191. Studied for metabolic pathway research.', defaultMg: 5, defaultMcg: 300 },
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
        <h1>Reference Library</h1>
        <p>{peptideLibrary.length} compounds</p>
      </div>

      <div className="search-bar">
        <IoSearch className="search-icon" size={18} />
        <input type="text" className="input" placeholder="Search compounds..." value={search} onChange={e => setSearch(e.target.value)} />
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
