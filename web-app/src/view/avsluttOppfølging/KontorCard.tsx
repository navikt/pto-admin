import React, { useState } from 'react';
import { Button, TextField, Tooltip } from '@navikt/ds-react';
import { hentKontorerMedHistorikk, KontorHistorikkQueryDto, KontorTilhorigheter } from '../../api/ao-oppfolgingskontor';
import dayjs from 'dayjs';

const KontorCard = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [kontorData, setKontorData] = useState<
		| {
				data: {
					kontorTilhorigheter: KontorTilhorigheter;
					kontorHistorikk: KontorHistorikkQueryDto[];
				};
		  }
		| undefined
	>(undefined);

	const fetchKontorData = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const ident = formData.get('ident') as string;
		setIsLoading(true);
		const result = await hentKontorerMedHistorikk({ ident });
		setIsLoading(false);
		setKontorData(result);
	};

	return (
		<div className="p-4 bg-gray-white">
			<form className="space-y-4" onSubmit={fetchKontorData}>
				<TextField name="ident" label={'NPID / Dnr / Fnr'} />
				<Button loading={isLoading} disabled={isLoading}>
					Hent
				</Button>
			</form>
			{kontorData ? <KontorTilhorigheter kontorTilhorigheter={kontorData.data.kontorTilhorigheter} /> : null}
			{kontorData ? <KontorHistorikk kontorHistorikk={kontorData.data.kontorHistorikk} /> : null}
		</div>
	);
};

const KontorTilhorigheter = ({ kontorTilhorigheter }: { kontorTilhorigheter: KontorTilhorigheter }) => {
	const arenaKontor = kontorTilhorigheter.arena;
	const arbeidsoppfolging = kontorTilhorigheter.arbeidsoppfolging;
	const gtKontor = kontorTilhorigheter.geografiskTilknytning;
	return (
		<div className="grid mb-4 border-b p-4 grid-cols-3 gap-y-2">
			<div>
				{arenaKontor ? (
					<span>
						<span className="font-bold">{arenaKontor.kontorId}</span> - {arenaKontor.kontorNavn}
					</span>
				) : (
					<span className="italic text-gray-700">Ingen arenakontor</span>
				)}
			</div>
			<div>
				{arbeidsoppfolging ? (
					<span>
						<span className="font-bold">{arbeidsoppfolging.kontorId}</span> - {arbeidsoppfolging.kontorNavn}
					</span>
				) : (
					<span className="italic text-gray-700">Ingen ao-kontor</span>
				)}
			</div>
			<div>
				{gtKontor ? (
					<span>
						<span className="font-bold">{gtKontor.kontorId}</span> - {gtKontor.kontorNavn}
					</span>
				) : (
					<span className="italic text-gray-700">Ingen gt-kontor</span>
				)}
			</div>
		</div>
	);
};

const KontorHistorikk = ({ kontorHistorikk }: { kontorHistorikk: KontorHistorikkQueryDto[] }) => {
	return (
		<ul>
			{kontorHistorikk.map(entry => {
				return (
					<li className="grid odd:bg-gray-100 py-1 grid-cols-10" key={entry.endretTidspunkt}>
						<span className="col-span-2">{entry.ident}</span>
						<span className="col-span-2">{entry.kontorType}</span>
						<span className="col-span-1">{entry.kontorId}</span>
						<span className="col-span-2">{entry.endretAv}</span>
						<span className="col-span-1">{entry.endretAvType}</span>
						<span className="col-span-2">{entry.endringsType}</span>
						<span className="col-span-2">
							<Tooltip content={entry.endretTidspunkt}>
								<span>{dayjs(entry.endretTidspunkt).fromNow()}</span>
							</Tooltip>
						</span>
					</li>
				);
			})}
		</ul>
	);
};

export default KontorCard;
