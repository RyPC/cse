import { TeacherDashboard } from '../dashboard/teacherDashboard/TeacherDashboard'
import ClassInfoModal from '../reviewModals/ClassInfoModal'

export const Playground = () => {
    return (
        <>
            <TeacherDashboard />
            <ClassInfoModal
              title="Yoga for Beginners"
              description="A beginner-friendly yoga class that focuses on flexibility and relaxation techniques."
              location="Downtown Studio, Room 301"
              capacity={20}
              level="beginner"
              costume="Comfortable clothes, no shoes"
            />
        </>
    )
};
