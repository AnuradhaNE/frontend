import React from 'react';

import Select from 'react-select';

import SectionMember from './section-member';

class CourseSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.section.name || '',
            description: props.section.description || '',
            semesterId: props.section.semesterId || null,
            members: props.section.members || []
        };
    }

    updateMember(index, member) {
        this.setState((previousState) => {
            let memberCount = previousState.members.length;
            let newMembers = previousState.members;

            // if new member then add object to array
            if (index >= memberCount) {
                let difference = index - memberCount - 1;

                while(difference > 0) {
                    newMembers.push({});
                }
            }

            newMembers[index] = member;
            return {members: newMembers};
        });
    }

    createSection(e) {
        e.preventDefault();

        let section = {
            name: this.state.name,
            description: this.state.description,
            semesterId: this.state.semesterId,
            members: this.state.members
        };

        return this.props.createSection(section);
    }

    onNameChange(e) {
        this.setState({name: e.target.value});
    }

    onDescriptionChange(e) {
        this.setState({description: e.target.value});
    }

    onSemesterChange(semesterId) {
        this.setState({semesterId: semesterId});
    }

    render() {
        var semesters = [
            { value: 1, label: 'Spring 2016' },
            { value: 2, label: 'Fall 2015' }
        ];

        let lastIndex = 0;

        let members = this.state.members.map((member) => {
            return (
                <SectionMember
                    email={member.email}
                    role={member.role}
                    updateMember={this.updateMember.bind(this, lastIndex)}
                    key={lastIndex++}
                />
            );
        });

        // always have one extra member field
        members.push(<SectionMember updateMember={this.updateMember.bind(this, lastIndex)} key={lastIndex++}/>);

        return (
            <div className="section">
                <h2 className="title">Create Section</h2>
                <div className="section-content">
                    <label>Section Name</label>
                    <div>
                        <input type="text" value={this.state.name} onChange={this.onNameChange.bind(this)}></input>
                    </div>
                    <label>Section Description</label>
                    <div>
                        <textarea value={this.state.description} onChange={this.onDescriptionChange.bind(this)}></textarea>
                    </div>
                    <label>Semester</label>
                    <Select
                        name="semester"
                        value={this.state.semesterId}
                        options={semesters}
                        clearable={false}
                        searchable={false}
                        onChange={this.onSemesterChange.bind(this)}
                    />
                    <label>Course Members</label>
                    <div>
                        {members}
                    </div>
                    <button type="submit" onClick={this.createSection.bind(this)}>{this.props.section.name ? 'Update Section' : 'Create Section'}</button>
                </div>
            </div>
        );
    }
}

CourseSection.defaultProps = {
    section: {}
};

export default CourseSection;