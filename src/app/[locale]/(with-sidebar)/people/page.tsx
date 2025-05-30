import { getPeople } from '#lib/dal';
import { Link } from '#i18n/navigation';
import { format } from 'date-fns';
import { getTranslations } from '#lib/i18n/server';
import DeleteButton from './components/DeleteButton';
import EditButton from './components/EditButton';

interface DiaryMention {
  id: string;
  content: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Person {
  id: string;
  name: string;
  birthday: Date | null;
  howWeMet: string | null;
  interests: string[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  mentions: DiaryMention[];
}

export default async function PeoplePage() {
  const t = await getTranslations();
  const people = await getPeople();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('people.title')}</h1>
        <Link
          href="/people/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('people.addPerson')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">{t('people.noPeople')}</p>
          </div>
        ) : (
          people.map((person) => (
            <div key={person.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/people/${person.id}`}
                  className="text-xl font-semibold hover:text-blue-600"
                >
                  {person.name}
                </Link>
                <div className="flex gap-2">
                  <DeleteButton
                    personId={person.id}
                    personName={person.name}
                    size="small"
                  />
                  <EditButton personId={person.id} size="small" />
                </div>
              </div>

              {person.birthday && (
                <p className="text-gray-600 mb-2">
                  {t('people.birthday')}:{' '}
                  {format(person.birthday, 'MMMM d, yyyy')}
                </p>
              )}

              {person.howWeMet && (
                <p className="text-gray-600 mb-2">
                  {t('people.howWeMet')}: {person.howWeMet}
                </p>
              )}

              {person.interests.length > 0 && (
                <div className="mb-2">
                  <p className="text-gray-600">{t('people.interests')}:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {person.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {person.notes && (
                <p className="text-gray-600 mb-2">
                  {t('people.notes')}: {person.notes}
                </p>
              )}

              <div className="mt-4 text-sm text-gray-500">
                {t('people.addedOn', {
                  date: format(person.createdAt, 'MMMM d, yyyy'),
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
