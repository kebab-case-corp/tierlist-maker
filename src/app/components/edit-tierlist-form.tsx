"use client";

import { ChangeEvent, FormEvent, SetStateAction, useState } from "react";
import useTierlistStore from "../store/useTierlistStore";
import { Criteria, Tier } from "../lib/definitions";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase/client";

function EditTierlistForm() {
    const { currentTierlist } = useTierlistStore((state) => state);
    const [name, setName] = useState(currentTierlist?.name);
    const [description, setDescription] = useState(currentTierlist?.description);
    const [criterias, setCriterias] = useState<Criteria[] | Omit<Criteria, "id">[]>(
        currentTierlist!!.criterias
    );
    const [tiers, setTiers] = useState<Tier[] | Omit<Tier, "id">[]>(currentTierlist!.tiers);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // try {
        // 	const { data, error } = await supabase
        // 		.from('tierlists')
        // 		.update({
        // 			name: name,
        // 			description: description,
        // 		})
        // 		.eq('id', currentTierlist!!.id);

        // 	const criteriaPromises = criterias.map(async (criteria) => {
        // 		if (criteria.id) {
        // 			return supabase
        // 				.from('criterias')
        // 				.update({ name: criteria.name, max_score: criteria.max_score })
        // 				.eq('id', criteria.id);
        // 		} else {
        // 			return supabase
        // 				.from('criterias')
        // 				.insert({ ...criteria, tierlist_id: currentTierlist!.id })
        // 				.select();
        // 		}
        // 	});
        // 	await Promise.all(criteriaPromises);
        // 	const tierPromises = tiers.map(async (tier) => {
        // 		if (tier.id) {
        // 			return supabase
        // 				.from('tiers')
        // 				.update({
        // 					name: tier.name,
        // 					min_score: tier.min_score,
        // 					background_color: tier.background_color,
        // 				})
        // 				.eq('id', tier.id);
        // 		} else {
        // 			return supabase
        // 				.from('tiers')
        // 				.insert({ ...tier, tierlist_id: currentTierlist!.id })
        // 				.select();
        // 		}
        // 	});
        // 	await Promise.all(tierPromises);
        // 	toast.success('Tierlist mise à jour avec succès!');
        // } catch (error) {
        // 	toast.error('Erreur lors de la mise à jour de la tierlist: ' + error);
        // }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Nom de la tierlist
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    placeholder={currentTierlist?.name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    required
                />
            </div>
            <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input w-full h-16"
                />
            </div>
            <CriteriasEditor criterias={criterias} setCriterias={setCriterias} />
            <TiersEditor tiers={tiers} setTiers={setTiers} />
            <button className="button bg-emerald-800 hover:bg-emerald-900 max-w-fit" type="submit">
                Enregistrer la modification
            </button>
        </form>
    );
}

function CriteriasEditor({
    criterias,
    setCriterias,
}: {
    criterias: Criteria[] | Omit<Criteria, "id">[];
    setCriterias: React.Dispatch<SetStateAction<Criteria[] | Omit<Criteria, "id">[]>>;
}) {
    const handleAddCriteria = () => {
        setCriterias([
            ...criterias,
            {
                name: "",
                max_score: 5,
                order: criterias.reduce((total, acc) => total + acc.order, 0),
            },
        ]);
    };

    const handleDeleteCriteria = async (e: FormEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        await supabase.from("criterias").delete().eq("id", index);
        setCriterias((prevCriterias) => prevCriterias.filter((_, i) => i !== index));
    };

    const handleChangeCriteria = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        field: "name" | "max_score"
    ) => {
        const value = field === "max_score" ? parseInt(e.target.value) : e.target.value;
        setCriterias((prevCriterias) =>
            prevCriterias.map((criteria, i) =>
                i === index ? { ...criteria, [field]: value } : criteria
            )
        );
    };

    return (
        <div className="grid gap-2">
            <h4 className="text-md font-medium text-white">Critères</h4>
            {criterias.map((criteria, index) => (
                <div key={index} className="flex gap-1">
                    <input
                        type="text"
                        value={criteria.name}
                        onChange={(e) => handleChangeCriteria(e, index, "name")}
                        placeholder="Nom du critère"
                        className="input"
                    />
                    <input
                        type="number"
                        value={criteria.max_score}
                        onChange={(e) => handleChangeCriteria(e, index, "max_score")}
                        placeholder="Score max du critère"
                        className="input w-24"
                        min={0}
                    />
                    <button
                        className={"button bg-rose-700 hover:bg-rose-800"}
                        onClick={(e) => handleDeleteCriteria(e, index)}
                    >
                        D
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddCriteria}
                className="button text-sm bg-slate-500 hover:bg-green-700"
            >
                Ajouter un critère
            </button>
        </div>
    );
}

function TiersEditor({
    tiers,
    setTiers,
}: {
    tiers: Tier[] | Omit<Tier, "id">[];
    setTiers: React.Dispatch<SetStateAction<Tier[] | Omit<Tier, "id">[]>>;
}) {
    const handleAddTier = () => {
        setTiers([...tiers, { name: "", min_score: 0, background_color: "#F44336" }]);
    };

    const handleDeleteTier = async (e: FormEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        await supabase.from("tiers").delete().eq("id", index);
        setTiers((prevTiers) => prevTiers.filter((_, i) => i !== index));
    };

    const handleChangeTier = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        field: "name" | "min_score" | "background_color"
    ) => {
        const value = field === "min_score" ? parseInt(e.target.value) : e.target.value;
        setTiers((prevTiers) =>
            prevTiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
        );
    };
    const handleChangeBackgroundColor = (color: string, index: number) => {
        console.log(tiers);
        setTiers((prevTiers) =>
            prevTiers.map((tier, i) => (i === index ? { ...tier, background_color: color } : tier))
        );
    };
    return (
        <div className="grid gap-2 mt-4">
            <h4 className="text-md font-medium text-white">Tiers</h4>
            {tiers
                .sort((a, b) => b.min_score - a.min_score)
                .map((tier, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleChangeTier(e, index, "name")}
                            placeholder="Nom du tier"
                            className="input flex-1"
                        />
                        <input
                            type="number"
                            value={tier.min_score}
                            onChange={(e) => handleChangeTier(e, index, "min_score")}
                            placeholder="Score minimal du tier"
                            className="input w-24"
                            min={0}
                        />
                        <HexColorPicker
                            color={tier.background_color ?? "#F44336"}
                            onChange={(e) => handleChangeBackgroundColor(e, index)}
                        />
                        <button
                            onClick={(e) => handleDeleteTier(e, index)}
                            className="button bg-rose-700 hover:bg-rose-800"
                        >
                            D
                        </button>
                    </div>
                ))}
            <button
                type="button"
                onClick={handleAddTier}
                className="button text-sm bg-slate-500 hover:bg-green-700"
            >
                Ajouter un tier
            </button>
        </div>
    );
}

export default EditTierlistForm;
