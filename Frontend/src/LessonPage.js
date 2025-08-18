import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Markdown from 'react-markdown';
import { db } from './firebase';
import { getDoc, getDocs, collection, doc } from 'firebase/firestore';
import LessonCard from './LessonCard';
import './LessonPage.css'

function LessonPage() {
    const [showSidebar, setShowSidebar] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState();
    const [discoverLessons, setDiscoverLessons] = useState([]);

    const discoverLessonCount = 4;

    React.useEffect(() => {
        async function fetchData() {
            const docs = await getDocs(collection(db, "Lessons"))
            const result = await getContent(id);
            setData(result);
            addDiscoverLessons(docs.docs.map(d => ({
                id: d.id,
                ...d.data()
            })));
        }
        function addDiscoverLessons(docsData) {
            const randomLessons = [];
            for (let i = 0; i < discoverLessonCount; i++) {
                const randomDoc = docsData[Math.floor(Math.random() * docsData.length)];
                randomLessons.push(randomDoc);
            }
            setDiscoverLessons(randomLessons);
        }
        fetchData();
    }, [id]);

    if (!data) return <h1>Error 404: Lesson not found.</h1>;
    
    return (
        <div className="lessonPage">
            <nav>
                <button onClick={() => setShowSidebar(!showSidebar)} className = 'sidebar-button'/>
                Navbar
            </nav>
            <aside id="sidebar" className={showSidebar ? 'show-sidebar' : ''} />
            <main>
                <h1 className='title'>{data.name}</h1>
                <Markdown>{data.content}</Markdown>
                <h2 className='discover-text'>Discover more</h2>
                <div className='discover'>
                    {discoverLessons.map((lesson, i) => (
                        <LessonCard 
                            key={i}
                            id={lesson.id}
                            name={lesson.name}
                            content={lesson.content.slice(20)}
                        />
                    ))}
                </div>
            </main>
            <footer />
        </div>
    );
}

async function getContent(id) {
    const docRef = doc(db, "Lessons", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}

export default LessonPage;