import { useState } from 'react';
import { IoSearch, IoBookOutline, IoChevronForward } from 'react-icons/io5';

const educationalTopics = [
  { title: 'What Are Peptides?', category: 'Basics', desc: 'Short chains of amino acids that serve as building blocks for proteins. Learn about the science behind peptide research.' },
  { title: 'Understanding Amino Acids', category: 'Basics', desc: 'The fundamental units of peptides and proteins. Explore the 20 standard amino acids and their roles.' },
  { title: 'Peptide Bonds Explained', category: 'Basics', desc: 'How amino acids link together through peptide bonds to form chains and structures.' },
  { title: 'Lyophilization', category: 'Lab Science', desc: 'The freeze-drying process used to preserve biological materials for research. Understanding powder forms.' },
  { title: 'Bacteriostatic Water', category: 'Lab Science', desc: 'Sterile water containing 0.9% benzyl alcohol, used in laboratory research for reconstitution.' },
  { title: 'Concentration Basics', category: 'Lab Science', desc: 'Understanding mg, mcg, and mL. How to calculate concentrations in research solutions.' },
  { title: 'Lab Safety', category: 'Safety', desc: 'Best practices for handling research materials safely. Sterile technique fundamentals.' },
  { title: 'Proper Storage', category: 'Safety', desc: 'Temperature and light requirements for research material preservation. Shelf life considerations.' },
  { title: 'Understanding Half-Lives', category: 'Science', desc: 'The concept of biological half-life and why it matters in research protocols.' },
  { title: 'Sleep & Recovery Science', category: 'Wellness', desc: 'How sleep quality affects cellular repair, hormone regulation, and overall wellness.' },
  { title: 'Metabolic Health', category: 'Wellness', desc: 'Understanding metabolism, energy balance, and the science of metabolic research.' },
  { title: 'Immune System Basics', category: 'Wellness', desc: 'How the immune system works and the role of peptides in immune research.' },
];

const categories = ['All', ...new Set(educationalTopics.map(p => p.category))];

export default function Library() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = educationalTopics.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

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
        <div key={i} className="peptide-card" style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'default' }}>
          <div className="peptide-icon"><IoBookOutline size={20} /></div>
          <div className="peptide-info">
            <div className="peptide-name">{p.title}</div>
            <div className="peptide-cat">{p.category}</div>
            <div className="peptide-desc">{p.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
