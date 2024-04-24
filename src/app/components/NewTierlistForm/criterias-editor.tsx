import { Criteria } from '@/app/lib/definitions'
import { ChangeEvent, FormEvent } from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

function TierlistCriteriasEditor({
    setCriterias,
    criterias,
}: {
    setCriterias: React.Dispatch<React.SetStateAction<Criteria[]>>
    criterias: Criteria[]
}) {
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
                        onChange={(e) => handleChangeCriteria(e, i, 'name')}
                    />
                    <label htmlFor={`criteria-max-rate--${i + 1}`}>
                        {'Note max: '}
                    </label>
                    <input
                        type="number"
                        id={`criteria-max-rate--${i + 1}`}
                        value={criteria.maxRate}
                        className={styles.input}
                        onChange={(e) => handleChangeCriteria(e, i, 'maxRate')}
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
                        onChange={(e) =>
                            handleChangeCriteria(e, i, 'description')
                        }
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
    )
}

export default TierlistCriteriasEditor
