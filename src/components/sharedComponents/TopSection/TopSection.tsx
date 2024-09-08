import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

import styles from './TopSection.module.scss'

interface TopSectionProps {
    onBack: string;
}

const TopSection = (props:TopSectionProps) => {
  
    const navigate = useNavigate()

    return (
    <div className={styles.container}>
        <Button
            onClick={()=>{
                navigate(props.onBack)
            }}
            outline
        >
            <FontAwesomeIcon className='mr-2' icon={faAngleLeft}/>Back
        </Button>
    </div>
  )
}

export default TopSection