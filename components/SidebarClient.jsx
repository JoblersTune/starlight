/** @jsx h */
import { h } from 'preact';
import { flattenSidebar } from '../utils/navigation';

function getCompletedPosts() {
    try {
        const data = localStorage.getItem('completedPosts');
        return new Set(data ? JSON.parse(data) : []);
    } catch (error) {
        console.error('Failed to parse completed posts:', error);
        return new Set();
    }
}

const getPostId = (label) => label.toLowerCase().replace(/\s+/g, '-');

const SidebarClient = ({ sublist, nested }) => {
    const completedPosts = getCompletedPosts();
    return (
        <ul className={`${nested ? '' : 'top-level'} no-bullets`}>
            {sublist.map((entry) => (
                <li key={entry.href || entry.label} className="sidebar-item">
                    {entry.type === 'link' ? (
                        <a
                            href={entry.href}
                            aria-current={entry.isCurrent && 'page'}
                            className={`${!nested ? 'large' : ''} ${entry.attrs.class}`}
                            {...entry.attrs}
                        >
                            {completedPosts.has(getPostId(entry.label)) && <span className="tick">✔</span>}
                            <span>{entry.label}</span>
                        </a>
                    ) : (
                        <details open={flattenSidebar(entry.entries).some((i) => i.isCurrent) || !entry.collapsed}>
                            <summary>
                                <div className="group-label">
                                    {completedPosts.has(getPostId(entry.label)) && <span className="tick">✔</span>}
                                    <span className="large">{entry.label}</span>
                                </div>
                            </summary>
                            <SidebarClient sublist={entry.entries} nested />
                        </details>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default SidebarClient;
