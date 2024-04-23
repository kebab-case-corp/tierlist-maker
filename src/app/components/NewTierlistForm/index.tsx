import { Criteria, Tier, Tierlist } from "@/app/lib/definitions";
import React, { ChangeEvent, FormEvent, SetStateAction, useState } from "react";
import styles from "@/app/components/NewTierlistForm/index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase-config";

function NewTierlistForm({
  userId,
  setAllTierlists,
}: {
  userId: string;
  setAllTierlists: React.Dispatch<React.SetStateAction<Tierlist[]>>;
}) {
  const [tiers, setTiers] = useState<Tier[]>([
    { name: "S", max: 20 },
    { name: "A", max: 16 },
    { name: "B", max: 12 },
    { name: "C", max: 8 },
    { name: "D", max: 4 },
  ]);

  const [criterias, setCriterias] = useState<Criteria[]>([
    { name: "", maxRate: 5, description: "" },
    { name: "", maxRate: 5, description: "" },
    { name: "", maxRate: 5, description: "" },
    { name: "", maxRate: 5, description: "" },
  ]);

  const [tierlist, setTierlist] = useState<Tierlist>({
    userId: userId,
    name: "",
    createdAt: new Date().getTime(),
    description: "",
    criterias: criterias,
    tiers: tiers,
  });

  console.log(tierlist);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "name" | "description"
  ) => {
    let prevTierlist = { ...tierlist };
    prevTierlist[field] = e.target.value;
    setTierlist(prevTierlist);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prevTierlist = { ...tierlist };
    prevTierlist.criterias = criterias;
    prevTierlist.tiers = tiers;
    prevTierlist.createdAt = new Date().getTime();
    try {
      const tierlistRef = collection(db, "tierlists");
      const docRef = await addDoc(tierlistRef, prevTierlist);
      prevTierlist.id = docRef.id;
      setTierlist(prevTierlist);
      setAllTierlists((prev) => [prevTierlist, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nouvelle Tierlist</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="tierlist-name">Nom:</label>
        <input
          type="text"
          id="tierlist-name"
          className={styles.input}
          onChange={(e) => handleChange(e, "name")}
          required
        ></input>
        <label htmlFor="tierlist-description">Description</label>
        <textarea
          name="description"
          id="tierlist-description"
          className={styles.input}
          cols={30}
          rows={5}
          onChange={(e) => handleChange(e, "description")}
        ></textarea>
        <NewTierForm setTiers={setTiers} tiers={tiers}></NewTierForm>
        <NewCriteriaForm
          setCriterias={setCriterias}
          criterias={criterias}
        ></NewCriteriaForm>
        <button type="submit" className={styles.submit}>
          Créer
        </button>
      </form>
    </div>
  );
}

function NewCriteriaForm({
  setCriterias,
  criterias,
}: {
  setCriterias: React.Dispatch<React.SetStateAction<Criteria[]>>;
  criterias: Criteria[];
}) {
  const handleCreateCriteria = () => {
    setCriterias([...criterias, { name: "", maxRate: 5, description: "" }]);
  };

  const handleDeleteCriteria = (
    e: FormEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    setCriterias((prevCriterias) =>
      prevCriterias.filter((_, i) => i !== index)
    );
  };

  const handleChangeCriteria = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: "name" | "maxRate" | "description"
  ) => {
    const value =
      field === "maxRate" ? parseInt(e.target.value) : e.target.value;
    setCriterias((prevCriterias) =>
      prevCriterias.map((criteria, i) =>
        i === index ? { ...criteria, [field]: value } : criteria
      )
    );
  };

  return (
    <>
      <h2>Critères:</h2>
      {criterias.map((criteria, i) => (
        <div className={styles.criteria} key={i.toString()}>
          <label htmlFor={`criteria-name--${i + 1}`}>{`Critère n°${
            i + 1
          }`}</label>
          <input
            type="text"
            id={`criteria-name--${i + 1}`}
            value={criteria.name}
            className={styles.input}
            onChange={(e) => handleChangeCriteria(e, i, "name")}
          />
          <label htmlFor={`criteria-max-rate--${i + 1}`}>{"Note max: "}</label>
          <input
            type="number"
            id={`criteria-max-rate--${i + 1}`}
            value={criteria.maxRate}
            className={styles.input}
            onChange={(e) => handleChangeCriteria(e, i, "maxRate")}
            min={0}
            max={20}
          />
          <label
            htmlFor={`criteria-description--${i + 1}`}
          >{`Description`}</label>
          <input
            type="text"
            id={`criteria-description--${i + 1}`}
            value={criteria.description}
            className={styles.input}
            onChange={(e) => handleChangeCriteria(e, i, "description")}
          />
          <button
            className={styles.delete}
            onClick={(e) => handleDeleteCriteria(e, i)}
          >
            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
          </button>
        </div>
      ))}
      <button className={styles.btn} onClick={handleCreateCriteria}>
        Ajouter un critere
      </button>
    </>
  );
}

function NewTierForm({
  setTiers,
  tiers,
}: {
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
  tiers: Tier[];
}) {
  const handleCreateTier = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTiers([...tiers, { name: "", max: 0 }]);
  };
  const handleDeleteTier = (e: FormEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setTiers((prevTiers) => prevTiers.filter((_, i) => i !== index));
  };

  const handleChangeTier = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: "name" | "max"
  ) => {
    const value = field === "name" ? e.target.value : parseInt(e.target.value);
    setTiers((prevTiers) =>
      prevTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      )
    );
  };

  return (
    <>
      <h2>Tiers:</h2>
      {tiers.map((tier, i) => (
        <div key={i.toString()} className={styles.tier}>
          <label htmlFor={`tier-name--${i + 1}`}>{`Tier ${i + 1}`}</label>
          <input
            type="text"
            id={`tier-name--${i + 1}`}
            value={tier.name}
            className={styles.input}
            onChange={(e) => handleChangeTier(e, i, "name")}
          />
          <label htmlFor={`tier-max--${i + 1}`}>{"Note max: "}</label>
          <input
            type="number"
            id={`tier-max--${i + 1}`}
            value={tier.max}
            className={styles.input}
            onChange={(e) => handleChangeTier(e, i, "max")}
            min={0}
            max={20}
          />
          <button
            className={styles.delete}
            onClick={(e) => handleDeleteTier(e, i)}
          >
            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
          </button>
        </div>
      ))}
      <button onClick={handleCreateTier} className={styles.btn}>
        Ajouter un tier
      </button>
    </>
  );
}

export default NewTierlistForm;
