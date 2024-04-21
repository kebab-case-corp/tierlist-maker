import { Criteria, Tier } from '@/app/lib/definitions'
import React, { ChangeEvent, FormEvent, useState } from 'react'

function NewTierlistForm({}) {
    const [tiers, setTiers] = useState<Tier[]>([
        { name: 'S', max: 20 },
        { name: 'A', max: 16 },
        { name: 'B', max: 12 },
        { name: 'C', max: 8 },
        { name: 'D', max: 4 },
    ])

    const [criterias, setCriterias] = useState<Criteria[]>([
        { name: '', maxRate: 5, description: '' },
        { name: '', maxRate: 5, description: '' },
        { name: '', maxRate: 5, description: '' },
        { name: '', maxRate: 5, description: '' },
    ])
    const handleCreateTier = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setTiers([...tiers, { name: '', max: 0 }])
    }
    const handleDeleteTier = (
        e: FormEvent<HTMLButtonElement>,
        index: number
    ) => {
        e.preventDefault()
        setTiers((prevTiers) => prevTiers.filter((_, i) => i !== index))
    }

    const handleCreateCriteria = () => {
        setCriterias([...criterias, { name: '', maxRate: 5, description: '' }])
    }

    const handleDeleteCriteria = (
        e: FormEvent<HTMLButtonElement>,
        index: number
    ) => {
        e.preventDefault()
        setCriterias((prevCriterias) =>
            prevCriterias.filter((_, i) => i !== index)
        )
    }

    const handleChangeTier = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        field: 'name' | 'max'
    ) => {
        const value =
            field === 'name' ? e.target.value : parseInt(e.target.value)
        setTiers((prevTiers) =>
            prevTiers.map((tier, i) =>
                i === index ? { ...tier, [field]: value } : tier
            )
        )
    }

    const handleChangeCriteria = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        field: 'name' | 'maxRate' | 'description'
    ) => {
        const value =
            field === 'maxRate' ? parseInt(e.target.value) : e.target.value
        setCriterias((prevCriterias) =>
            prevCriterias.map((criteria, i) =>
                i === index ? { ...criteria, [field]: value } : criteria
            )
        )
    }

    return (
        <div>
            <h1>Nouvelle Tierlist</h1>
            <form>
                <label htmlFor="name">Nom:</label>
                <input type="text" id="name" required></input>
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="tierlist-desc" />
                <h2>Tiers:</h2>
                {tiers.map((tier, i) => (
                    <div key={i.toString()}>
                        <label htmlFor={i.toString()}>{`Tier ${i + 1}`}</label>
                        <input
                            type="text"
                            id={i.toString()}
                            value={tier.name}
                            onChange={(e) => handleChangeTier(e, i, 'name')}
                        />
                        <label htmlFor={'max' + i.toString()}>
                            {'Note max: '}
                        </label>
                        <input
                            type="number"
                            id={'max' + i.toString()}
                            value={tier.max}
                            onChange={(e) => handleChangeTier(e, i, 'max')}
                            min={0}
                            max={20}
                        />
                        <button onClick={(e) => handleDeleteTier(e, i)}>
                            Supprimer le tier
                        </button>
                    </div>
                ))}
                <button onClick={handleCreateTier}>Ajouter un tier</button>
                <h2>Critères:</h2>
                {criterias.map((criteria, i) => (
                    <div key={i.toString()}>
                        <label htmlFor={i.toString()}>{`Critère n°${
                            i + 1
                        }`}</label>
                        <input
                            type="text"
                            id={i.toString()}
                            value={criteria.name}
                            onChange={(e) => handleChangeCriteria(e, i, 'name')}
                        />
                        <label htmlFor={'max' + i.toString()}>
                            {'Note max: '}
                        </label>
                        <input
                            type="number"
                            id={'criteria-max-' + i.toString()}
                            value={criteria.maxRate}
                            onChange={(e) =>
                                handleChangeCriteria(e, i, 'maxRate')
                            }
                            min={0}
                            max={20}
                        />
                        <label htmlFor={i.toString()}>{`Description`}</label>
                        <input
                            type="text"
                            id={i.toString()}
                            value={criteria.description}
                            onChange={(e) =>
                                handleChangeCriteria(e, i, 'description')
                            }
                        />
                        <button onClick={(e) => handleDeleteCriteria(e, i)}>
                            Supprimer le critère
                        </button>
                    </div>
                ))}
                <button onClick={handleCreateCriteria}>
                    Ajouter un critere
                </button>
                <button type="submit">Créer</button>
            </form>
        </div>
    )
}

export default NewTierlistForm
