import { Tier } from '@/app/lib/definitions'
import { ChangeEvent, FormEvent } from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

function TierlistTiersEditor({
    setTiers,
    tiers,
}: {
    setTiers: React.Dispatch<React.SetStateAction<Tier[]>>
    tiers: Tier[]
}) {
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

    return (
        <>
            <h2>Tiers:</h2>
            {tiers.map((tier, i) => (
                <div key={i.toString()} className={styles.tier}>
                    <label htmlFor={`tier-name--${i + 1}`}>{`Tier ${
                        i + 1
                    }`}</label>
                    <input
                        type="text"
                        id={`tier-name--${i + 1}`}
                        value={tier.name}
                        className={styles.input}
                        onChange={(e) => handleChangeTier(e, i, 'name')}
                    />
                    <label htmlFor={`tier-max--${i + 1}`}>{'Note max: '}</label>
                    <input
                        type="number"
                        id={`tier-max--${i + 1}`}
                        value={tier.max}
                        className={styles.input}
                        onChange={(e) => handleChangeTier(e, i, 'max')}
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
    )
}

export default TierlistTiersEditor
