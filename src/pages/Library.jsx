import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoFlaskOutline, IoChevronForward } from 'react-icons/io5';

const peptideLibrary = [
  { name: 'Sample Solution A', category: 'Recovery', desc: 'Experimental test solution. Commonly studied for tissue repair applications in vitro.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Sample Solution B', category: 'Metabolic', desc: 'Metabolic research compound used for GLP-1 receptor studies.', defaultMg: 10, defaultMcg: 2500 },
  { name: 'Sample Solution C', category: 'Growth Hormone', desc: 'Synthetic secretagogue used in laboratory growth hormone research.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Sample Solution D', category: 'Metabolic', desc: 'Dual-action compound. Studied for metabolic pathway research.', defaultMg: 10, defaultMcg: 2500 },
  { name: 'Sample Solution E', category: 'Growth Hormone', desc: 'GHRH analog compound. Commonly paired in research stacks.', defaultMg: 5, defaultMcg: 100 },
  { name: 'Sample Solution F', category: 'Growth Hormone', desc: 'Selective secretagogue. Studied for GH pulse research applications.', defaultMg: 5, defaultMcg: 200 },
  { name: 'Sample Solution G', category: 'Growth Hormone', desc: 'Oral secretagogue. Studied for IGF-1 and GH research.', defaultMg: 25, defaultMcg: 25000 },
  { name: 'Sample Solution H', category: 'Anti-Aging', desc: 'Copper peptide. Studied for skin and collagen synthesis research.', defaultMg: 50, defaultMcg: 200 },
  { name: 'Sample Solution I', category: 'Anti-Aging', desc: 'Telomerase activator. Studied for cellular longevity research.', defaultMg: 10, defaultMcg: 5000 },
  { name: 'Compound J', category: 'Other', desc: 'Melanocortin receptor agonist. Studied in various research applications.', defaultMg: 10, defaultMcg: 1750 },
  { name: 'Compound K', category: 'Immune', desc: 'Immune modulator peptide. Studied for immune system research.', defaultMg: 5, defaultMcg: 1600 },
  { name: 'Compound L', category: 'Anti-Aging', desc: 'Mitochondrial-targeted peptide. Studied for cellular energy research.', defaultMg: 5, defaultMcg: 500 },
  { name: 'Compound M', category: 'Other', desc: 'Anxiolytic peptide. Studied for cognitive enhancement research.', defaultMg: 5, defaultMcg: 250 },
  { name: 'Compound N', category: 'Other', desc: 'Nootropic peptide. Studied for cognitive function research.', defaultMg: 5, defaultMcg: 200 },
  { name: 'Compound O', category: 'Other', desc: 'Sleep-regulating peptide. Studied for sleep pattern research.', defaultMg: 5, defaultMcg: 100 },
  { name: 'Compound P', category: 'Metabolic', desc: 'GH fragment. Studied for metabolic pathway research.', defaultMg: 5, defaultMcg: 300 },
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
