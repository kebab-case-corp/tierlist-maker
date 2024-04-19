import React, { FormEvent, useState } from "react";

function NewTierlistForm({}) {
  const [tiers, setTiers] = useState([
    { name: "", max: 0 },
    { name: "", max: 0 },
    { name: "", max: 0 },
    { name: "", max: 0 },
  ]);

  const [criterias, setCriterias] = useState([{}]);
  const handleCreateTier = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTiers([...tiers, { name: "", max: 0 }]);
  };
  const handleDeleteCurrentTier = (
    e: FormEvent<HTMLButtonElement>,
    i: number
  ) => {
    e.preventDefault();
    let tablo = [...tiers];
    tablo.splice(i, 1);
    setTiers(tablo);
  };
  return (
    <div>
      <h1>Create your tierlist</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" required></input>
        <h2>Add tiers</h2>
        <button onClick={handleCreateTier}>Add a tier</button>
        {tiers.map((tier, i) => (
          <div key={i.toString()}>
            <label htmlFor={i.toString()}>{"Tier " + i}</label>
            <input type="text" id={i.toString()}></input>
            <label htmlFor={"max" + i.toString()}>{"Max rate: "}</label>
            <input type="text" id={"max" + i.toString()}></input>
            <button onClick={(e) => handleDeleteCurrentTier(e, i)}>
              Delete this tier
            </button>
          </div>
        ))}
      </form>
    </div>
  );
}

export default NewTierlistForm;
